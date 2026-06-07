const express = require('express');
const passport = require('passport');
const router = express.Router();
const { signup, login, googleCallback } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

router.get('/me', requireAuth, (req, res) => {
  res.json({
    _id: req.user._id,
    email: req.user.email,
    displayName: req.user.displayName,
    avatar: req.user.avatar,
  });
});

module.exports = router;
