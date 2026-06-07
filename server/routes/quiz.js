const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const quizController = require('../controllers/quizController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/upload', authenticateJWT, upload.single('pdf'), quizController.uploadQuiz);
router.get('/:shareId', authenticateJWT, quizController.getQuiz);
router.post('/:shareId/submit', authenticateJWT, quizController.submitQuiz);
router.post('/:shareId/adaptive-retake', authenticateJWT, quizController.generateAdaptiveRetake);
router.get('/:shareId/leaderboard', quizController.getLeaderboard);

module.exports = router;
