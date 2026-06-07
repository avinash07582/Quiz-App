const InterviewSession = require('../models/InterviewSession');
const { parsePDF } = require('../services/pdfService');
const { generateInterviewQuestions, gradeInterviewResponses } = require('../services/openaiService');

let _nanoid;
async function getNanoid() {
  if (!_nanoid) { const m = await import('nanoid'); _nanoid = m.nanoid; }
  return _nanoid;
}

// POST /api/interview/upload
const uploadResume = async (req, res) => {
  try {
    const targetRole = req.body.targetRole || 'Software Engineer';
    let resumeText = '';
    let resumeTitle = 'Direct Input / Standard Profile';

    if (req.file) {
      console.log('[INTERVIEW] Parsing resume PDF...');
      const { text } = await parsePDF(req.file.buffer);
      resumeText = text;
      resumeTitle = req.file.originalname;
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    }

    console.log('[INTERVIEW] Generating customized interview rounds for role:', targetRole);
    const questionsData = await generateInterviewQuestions(resumeText, targetRole);

    if (!questionsData || !questionsData.length) {
      throw new Error("AI failed to generate interview questions. Please try again.");
    }

    const nanoid = await getNanoid();
    const shareId = nanoid(8);

    const normalizedQuestions = questionsData.map((q) => {
      let rawCat = (q.category || 'Technical').trim();
      let cat = 'Technical';

      if (rawCat.toLowerCase().includes('behav') || rawCat.toLowerCase().includes('hr') || rawCat.toLowerCase().includes('cultur')) {
        cat = 'Behavioral / HR';
      } else if (rawCat.toLowerCase().includes('system') || rawCat.toLowerCase().includes('design') || rawCat.toLowerCase().includes('scal') || rawCat.toLowerCase().includes('arch')) {
        cat = 'System Design';
      }

      const qType = q.type === 'mcq' ? 'mcq' : 'open';

      return {
        type: qType,
        category: cat,
        question: q.question || 'Explain your problem-solving approach for this scenario.',
        options: Array.isArray(q.options) ? q.options : [],
        correctOption: q.correctOption || '',
        sampleAnswer: q.sampleAnswer || 'A strong answer covers requirements, core architecture, trade-offs, and edge cases.',
        userResponse: '',
      };
    });

    const session = new InterviewSession({
      userId: req.user?._id || null,
      shareId,
      resumeTitle,
      targetRole,
      status: 'in_progress',
      questions: normalizedQuestions,
    });

    await session.save();
    console.log('[INTERVIEW] Setup complete! shareId:', shareId);

    res.status(201).json({ shareId, targetRole, questionCount: session.questions.length });
  } catch (err) {
    console.error('Interview setup error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/interview/:shareId
const getSession = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ shareId: req.params.shareId });
    if (!session) return res.status(404).json({ error: 'Interview session not found.' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/interview/:shareId/submit
const submitSession = async (req, res) => {
  try {
    const { responses } = req.body;
    const session = await InterviewSession.findOne({ shareId: req.params.shareId });
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    const evaluationPayload = session.questions.map((q, idx) => {
      const userRes = responses[idx] || '';
      q.userResponse = userRes;
      return {
        type: q.type,
        question: q.question,
        category: q.category,
        options: q.options,
        correctOption: q.correctOption,
        sampleExpectedAnswer: q.sampleAnswer,
        candidateResponse: userRes,
      };
    });

    console.log('[INTERVIEW] Grading candidate answers via AI...');
    const gradingResults = await gradeInterviewResponses(evaluationPayload);

    let totalScore = 0;
    session.questions.forEach((q, idx) => {
      const result = gradingResults.gradedQuestions?.[idx] || { score: 7, aiFeedback: 'Good conceptual approach.' };
      if (q.type === 'mcq') {
        const isCorrect = q.userResponse?.trim().toLowerCase() === q.correctOption?.trim().toLowerCase() ||
          q.userResponse?.trim()[0]?.toLowerCase() === q.correctOption?.trim()[0]?.toLowerCase();
        q.score = isCorrect ? 10 : 0;
        q.aiFeedback = isCorrect ? `Correct! ${q.sampleAnswer}` : `Incorrect. The correct option was ${q.correctOption}. ${q.sampleAnswer}`;
      } else {
        q.score = result.score || 0;
        q.aiFeedback = result.aiFeedback || 'Clear communication and logical structure.';
      }
      totalScore += q.score;
    });

    session.overallScore = gradingResults.overallScore || Math.round((totalScore / (session.questions.length * 10)) * 100);
    session.strengths = gradingResults.strengths || ['Strong conceptual grasp of core architecture', 'Effective communication'];
    session.improvementAreas = gradingResults.improvementAreas || ['Expand technical depth in edge-case optimization'];
    session.status = 'completed';
    session.completedAt = new Date();

    await session.save();
    console.log('[INTERVIEW] Grading complete! Overall score:', session.overallScore);

    res.json(session);
  } catch (err) {
    console.error('Interview submit error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadResume, getSession, submitSession };
