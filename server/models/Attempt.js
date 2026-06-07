const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: Number,
  answer: String,
  isCorrect: Boolean,
});

const attemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  shareId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  playerName: { type: String, required: true },
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }, // seconds
  answers: [answerSchema],
  skippedQuestions: [Number],
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attempt', attemptSchema);
