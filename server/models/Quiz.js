const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq', 'truefalse', 'fillintheblank', 'shortanswer'], required: true },
  question: { type: String, required: true },
  options: [String],          // MCQ only
  answer: { type: String, required: true },
  explanation: { type: String, default: '' }, // AI Tutor explanation
  points: { type: Number, default: 1 },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shareId: { type: String, required: true, unique: true },
  pdfName: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  detectedTopic: { type: String, default: 'General CS' },
  subtopics: [String],
  rawText: [String], // Stored PDF chunks for generating study notes and adaptive retakes
  category: { type: String, default: 'General' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'expert'], default: 'medium' },
  questions: [questionSchema],
  timeLimit: { type: Number, default: 600 }, // seconds
  questionCount: { type: Number, default: 15 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', quizSchema);
