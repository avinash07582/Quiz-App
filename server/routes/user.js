const express = require('express');
const router = express.Router();
const { getProfile, getDashboardData } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.get('/profile', requireAuth, getProfile);
router.get('/dashboard', requireAuth, getDashboardData);

module.exports = router;
