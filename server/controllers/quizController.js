const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const { parsePDF } = require('../services/pdfService');
const { generateQuestions, detectTopicAndSubtopics, generateAdaptiveQuiz } = require('../services/openaiService');
const { emitLeaderboardUpdate } = require('../services/socketService');

let _nanoid;
async function getNanoid() {
  if (!_nanoid) { const m = await import('nanoid'); _nanoid = m.nanoid; }
  return _nanoid;
}

// POST /api/quiz/upload
const uploadQuiz = async (req, res) => {
  try {
    console.log('[UPLOAD] Received request');
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const questionCount = parseInt(req.body.questionCount) || 15;
    const timeLimit = parseInt(req.body.timeLimit) || 600;
    const difficulty = req.body.difficulty || 'medium';
    let category = req.body.category || 'General';

    // 1. Parse PDF
    console.log('[UPLOAD] Parsing PDF...');
    const { text, chunks } = await parsePDF(req.file.buffer);

    // 2. Detect Topic and Subtopics
    console.log('[UPLOAD] Detecting topic...');
    const { detectedTopic, subtopics } = await detectTopicAndSubtopics(text);
    if (detectedTopic && category === 'General') {
      category = detectedTopic;
    }

    // 3. Generate questions via Gemini
    console.log('[UPLOAD] Generating questions...');
    const { questions, title } = await generateQuestions(chunks, questionCount, text, { difficulty });

    // 4. Save quiz
    console.log('[UPLOAD] Saving quiz...');
    const nanoid = await getNanoid();
    const shareId = nanoid(8);
    const quiz = new Quiz({
      title,
      shareId,
      pdfName: req.file.originalname,
      creator: req.user?._id,
      detectedTopic: category,
      subtopics,
      rawText: chunks,
      category,
      difficulty,
      questions,
      timeLimit,
      questionCount: questions.length,
    });

    await quiz.save();
    console.log('[UPLOAD] Quiz saved! shareId:', shareId);

    res.status(201).json({
      shareId,
      title,
      detectedTopic: category,
      subtopics,
      questionCount: questions.length,
      timeLimit,
    });
  } catch (err) {
    console.error('Upload error:', err.message, err.stack);
    res.status(500).json({ error: err.message || 'Failed to generate quiz.' });
  }
};

// GET /api/quiz/:shareId
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ shareId: req.params.shareId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    // Return safe quiz without answers or explanations for active play
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      shareId: quiz.shareId,
      pdfName: quiz.pdfName,
      detectedTopic: quiz.detectedTopic,
      subtopics: quiz.subtopics,
      timeLimit: quiz.timeLimit,
      difficulty: quiz.difficulty,
      questionCount: quiz.questions.length,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        type: q.type,
        question: q.question,
        options: q.options,
        points: q.points,
      })),
    };

    res.json(safeQuiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/quiz/:shareId/submit
const submitQuiz = async (req, res) => {
  try {
    const { playerName, answers, timeTaken, skippedQuestions = [] } = req.body;

    if (!playerName || !answers) {
      return res.status(400).json({ error: 'Missing playerName or answers.' });
    }

    const quiz = await Quiz.findOne({ shareId: req.params.shareId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    let score = 0;
    let maxScore = 0;
    let correctAnswersCount = 0;

    const gradedAnswers = quiz.questions.map((q, index) => {
      const submitted = answers[index] || '';
      maxScore += q.points;
      let isCorrect = false;

      if (q.type === 'fillintheblank' || q.type === 'truefalse') {
        isCorrect = submitted.trim().toLowerCase() === q.answer.trim().toLowerCase();
      } else {
        isCorrect =
          submitted.trim().toLowerCase() === q.answer.trim().toLowerCase() ||
          submitted.trim()[0]?.toLowerCase() === q.answer.trim()[0]?.toLowerCase();
      }

      if (isCorrect) {
        score += q.points;
        correctAnswersCount++;
      }

      return {
        questionIndex: index,
        answer: submitted,
        isCorrect,
        correctAnswer: q.answer,
        question: q.question,
        type: q.type,
        explanation: q.explanation || 'No explanation available for this question.',
      };
    });

    // Save attempt
    const attempt = new Attempt({
      quizId: quiz._id,
      shareId: req.params.shareId,
      userId: req.user?._id,
      playerName,
      score,
      maxScore,
      timeTaken: timeTaken || 0,
      skippedQuestions,
      answers: gradedAnswers.map(({ questionIndex, answer, isCorrect }) => ({
        questionIndex,
        answer,
        isCorrect,
      })),
    });

    await attempt.save();

    // Update user stats & topic mastery
    if (req.user?._id) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.lastActiveDate = new Date();
        user.stats.totalQuizzesTaken += 1;
        user.stats.totalScore += score;

        // Update topic mastery
        const topicKey = quiz.detectedTopic || 'General CS';
        const currentMastery = user.topicMastery.get(topicKey) || { attempted: 0, correct: 0, level: 'Beginner' };
        currentMastery.attempted += quiz.questions.length;
        currentMastery.correct += correctAnswersCount;

        const ratio = currentMastery.correct / currentMastery.attempted;
        if (currentMastery.attempted >= 30 && ratio >= 0.85) currentMastery.level = 'Master';
        else if (currentMastery.attempted >= 20 && ratio >= 0.75) currentMastery.level = 'Advanced';
        else if (currentMastery.attempted >= 10 && ratio >= 0.6) currentMastery.level = 'Intermediate';

        user.topicMastery.set(topicKey, currentMastery);

        // Award Badges
        if (score === maxScore && !user.stats.badges.includes('Flawless Victory')) {
          user.stats.badges.push('Flawless Victory');
        }
        if (timeTaken < 120 && ratio > 0.8 && !user.stats.badges.includes('Speed Runner')) {
          user.stats.badges.push('Speed Runner');
        }

        await user.save();
      }
    }

    const leaderboard = await getLeaderboardData(req.params.shareId);
    emitLeaderboardUpdate(req.params.shareId, leaderboard);

    res.json({
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      gradedAnswers,
      leaderboard,
    });
  } catch (err) {
    console.error('Submit error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/quiz/:shareId/adaptive-retake
const generateAdaptiveRetake = async (req, res) => {
  try {
    const { attemptId } = req.body;
    const parentQuiz = await Quiz.findOne({ shareId: req.params.shareId });
    if (!parentQuiz) return res.status(404).json({ error: 'Quiz not found.' });

    let incorrectIndices = [];
    if (attemptId) {
      const attempt = await Attempt.findById(attemptId);
      if (attempt) {
        incorrectIndices = attempt.answers.filter(a => !a.isCorrect).map(a => a.questionIndex);
      }
    } else {
      incorrectIndices = parentQuiz.questions.map((_, i) => i).slice(0, 5); // Fallback
    }

    if (incorrectIndices.length === 0) {
      return res.status(400).json({ error: 'Perfect score on previous attempt! No weak areas to target.' });
    }

    console.log('[ADAPTIVE] Generating targeted questions...');
    const fullText = parentQuiz.rawText ? parentQuiz.rawText.join('\n') : parentQuiz.title;
    const newQuestions = await generateAdaptiveQuiz(parentQuiz.questions, incorrectIndices, fullText);

    const nanoid = await getNanoid();
    const newShareId = nanoid(8);
    const adaptiveQuiz = new Quiz({
      title: `Adaptive Focus: ${parentQuiz.title}`,
      shareId: newShareId,
      pdfName: parentQuiz.pdfName,
      creator: req.user?._id,
      detectedTopic: parentQuiz.detectedTopic,
      subtopics: parentQuiz.subtopics,
      rawText: parentQuiz.rawText,
      category: parentQuiz.category,
      difficulty: 'hard', // Adaptive focus is inherently challenging
      questions: newQuestions,
      timeLimit: parentQuiz.timeLimit,
      questionCount: newQuestions.length,
    });

    await adaptiveQuiz.save();
    res.json({ shareId: newShareId });
  } catch (err) {
    console.error('Adaptive retake error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getLeaderboardData(req.params.shareId);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getLeaderboardData(shareId) {
  const attempts = await Attempt.find({ shareId })
    .sort({ score: -1, timeTaken: 1 })
    .limit(50)
    .lean();

  return attempts.map((a, i) => ({
    rank: i + 1,
    playerName: a.playerName,
    score: a.score,
    maxScore: a.maxScore,
    percentage: Math.round((a.score / a.maxScore) * 100),
    timeTaken: a.timeTaken,
    completedAt: a.completedAt,
  }));
}

module.exports = { uploadQuiz, getQuiz, submitQuiz, generateAdaptiveRetake, getLeaderboard };
