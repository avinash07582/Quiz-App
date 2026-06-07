const express = require('express');
const router = express.Router();
const { generateNotes, getNotes, updateFlashcardMastery } = require('../controllers/notesController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/generate', authenticateJWT, generateNotes);
router.get('/:shareId', getNotes);
router.put('/:shareId/flashcard', authenticateJWT, updateFlashcardMastery);

module.exports = router;
