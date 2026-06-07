const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  masteryLevel: { type: String, enum: ['new', 'easy', 'medium', 'hard', 'mastered'], default: 'new' },
  lastReviewed: { type: Date, default: Date.now },
  nextReview: { type: Date, default: Date.now },
});

const studyNotesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  shareId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  topic: { type: String, default: 'General CS' },
  summary: { type: String, required: true },
  keyConcepts: [{
    concept: { type: String, required: true },
    explanation: { type: String, required: true },
  }],
  formulasOrSnippets: [{
    title: { type: String },
    content: { type: String },
  }],
  interviewQuestions: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    difficulty: { type: String, default: 'medium' },
  }],
  flashcards: [flashcardSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StudyNotes', studyNotesSchema);
