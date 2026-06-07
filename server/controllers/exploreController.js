const Quiz = require('../models/Quiz');

const getTopics = async (req, res) => {
  try {
    const topics = await Quiz.aggregate([
      { $group: { _id: "$detectedTopic", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    res.json(topics);
  } catch (err) {
    console.error('Get topics error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const { topic, difficulty, search } = req.query;
    const filter = {};

    if (topic && topic !== 'All') {
      filter.detectedTopic = topic;
    }
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const quizzes = await Quiz.find(filter)
      .select('title shareId detectedTopic difficulty questionCount timeLimit createdAt creator')
      .populate('creator', 'displayName avatar')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(quizzes);
  } catch (err) {
    console.error('Get quizzes error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTopics, getQuizzes };
