const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadResume, getSession, submitSession } = require('../controllers/interviewController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/upload', authenticateJWT, upload.single('resume'), uploadResume);
router.get('/:shareId', getSession);
router.post('/:shareId/submit', authenticateJWT, submitSession);

module.exports = router;
