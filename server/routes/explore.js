const express = require('express');
const router = express.Router();
const { getTopics, getQuizzes } = require('../controllers/exploreController');

router.get('/topics', getTopics);
router.get('/quizzes', getQuizzes);

module.exports = router;
