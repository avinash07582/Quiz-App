const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const attempts = await Attempt.find({ userId: req.user._id });
    const totalQuizzesTaken = attempts.length;
    const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);

    // Calculate streak
    const now = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) {
      const diffTime = Math.abs(now - lastActive);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.stats.currentStreak += 1;
      } else if (diffDays > 1) {
        user.stats.currentStreak = 1;
      }
      if (user.stats.currentStreak > user.stats.highestStreak) {
        user.stats.highestStreak = user.stats.currentStreak;
      }
    } else {
      user.stats.currentStreak = 1;
      user.stats.highestStreak = 1;
      user.lastActiveDate = now;
    }

    user.stats.totalQuizzesTaken = totalQuizzesTaken;
    user.stats.totalScore = totalScore;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const createdQuizzes = await Quiz.find({ creator: req.user._id }).sort({ createdAt: -1 });
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate('quizId', 'title category difficulty detectedTopic')
      .sort({ completedAt: -1 });

    // Format topic mastery map into array
    const topicAnalytics = [];
    if (user && user.topicMastery) {
      user.topicMastery.forEach((val, key) => {
        topicAnalytics.push({
          topic: key,
          attempted: val.attempted,
          correct: val.correct,
          accuracy: val.attempted > 0 ? Math.round((val.correct / val.attempted) * 100) : 0,
          level: val.level || 'Beginner',
        });
      });
    }

    res.json({
      user,
      createdQuizzes,
      recentAttempts: attempts,
      topicAnalytics,
      stats: user?.stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfile, getDashboardData };
