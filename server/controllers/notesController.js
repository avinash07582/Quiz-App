const StudyNotes = require('../models/StudyNotes');
const Quiz = require('../models/Quiz');
const { generateStudyNotes } = require('../services/openaiService');

let _nanoid;
async function getNanoid() {
  if (!_nanoid) { const m = await import('nanoid'); _nanoid = m.nanoid; }
  return _nanoid;
}

const generateNotes = async (req, res) => {
  try {
    const { shareId } = req.body;
    if (!shareId) return res.status(400).json({ error: 'Quiz shareId required.' });

    const quiz = await Quiz.findOne({ shareId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    // Check if notes already exist for this quiz using the verified quiz ObjectId
    const existingNotes = await StudyNotes.findOne({ quizId: quiz._id });
    if (existingNotes) {
      return res.json({ shareId: existingNotes.shareId });
    }

    console.log('[NOTES] Generating AI study guide & flashcards...');
    const fullText = quiz.rawText ? quiz.rawText.join('\n') : quiz.title;
    const aiData = await generateStudyNotes(fullText, quiz.detectedTopic || 'General CS');

    const nanoid = await getNanoid();
    const notesShareId = nanoid(8);

    const studyNotes = new StudyNotes({
      userId: req.user?._id || null,
      quizId: quiz._id,
      shareId: notesShareId,
      title: aiData.title || `Study Guide: ${quiz.title}`,
      topic: quiz.detectedTopic || 'General CS',
      summary: aiData.summary || 'Summary unavailable.',
      keyConcepts: aiData.keyConcepts || [],
      formulasOrSnippets: aiData.formulasOrSnippets || [],
      interviewQuestions: aiData.interviewQuestions || [],
      flashcards: (aiData.flashcards || []).map(fc => ({
        front: fc.front,
        back: fc.back,
        masteryLevel: 'new',
        lastReviewed: new Date(),
        nextReview: new Date(),
      })),
    });

    await studyNotes.save();
    console.log('[NOTES] Saved successfully! shareId:', notesShareId);

    res.status(201).json({ shareId: notesShareId });
  } catch (err) {
    console.error('Generate notes error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await StudyNotes.findOne({ shareId: req.params.shareId });
    if (!notes) return res.status(404).json({ error: 'Study notes not found.' });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFlashcardMastery = async (req, res) => {
  try {
    const { cardId, masteryLevel } = req.body;
    const notes = await StudyNotes.findOne({ shareId: req.params.shareId });
    if (!notes) return res.status(404).json({ error: 'Notes not found.' });

    const card = notes.flashcards.id(cardId);
    if (!card) return res.status(404).json({ error: 'Flashcard not found.' });

    const now = new Date();
    let daysToAdd = 1;
    if (masteryLevel === 'easy') daysToAdd = 7;
    else if (masteryLevel === 'good') daysToAdd = 3;
    else if (masteryLevel === 'hard') daysToAdd = 1;

    card.masteryLevel = masteryLevel === 'easy' ? 'mastered' : masteryLevel;
    card.lastReviewed = now;
    card.nextReview = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    await notes.save();
    res.json({ success: true, flashcard: card });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateNotes, getNotes, updateFlashcardMastery };
