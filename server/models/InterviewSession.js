const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['open', 'mcq'], default: 'open' },
  category: { type: String, enum: ['Technical', 'System Design', 'Behavioral / HR'], required: true },
  question: { type: String, required: true },
  options: [String], // for MCQ
  correctOption: { type: String }, // for MCQ
  sampleAnswer: { type: String },
  userResponse: { type: String, default: '' },
  aiFeedback: { type: String, default: '' },
  score: { type: Number, default: 0 }, // 0 to 10
});

const interviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shareId: { type: String, required: true, unique: true },
  resumeTitle: { type: String, default: 'Uploaded Resume' },
  targetRole: { type: String, default: 'Software Engineer' },
  status: { type: String, enum: ['setup', 'in_progress', 'completed'], default: 'in_progress' },
  questions: [interviewQuestionSchema],
  overallScore: { type: Number, default: 0 }, // 0 to 100
  strengths: [String],
  improvementAreas: [String],
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
