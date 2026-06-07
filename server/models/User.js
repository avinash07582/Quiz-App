const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  googleId: { type: String, sparse: true },
  displayName: { type: String },
  avatar: { type: String },
  lastActiveDate: { type: Date },
  stats: {
    totalQuizzesTaken: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    highestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    badges: [String],
  },
  // Map of topic name -> { attempted: number, correct: number, level: string }
  topicMastery: {
    type: Map,
    of: new mongoose.Schema({
      attempted: { type: Number, default: 0 },
      correct: { type: Number, default: 0 },
      level: { type: String, default: 'Beginner' }, // Beginner, Intermediate, Advanced, Master
    }, { _id: false }),
    default: {},
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
