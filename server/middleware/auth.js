const passport = require('passport');

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Allow unauthenticated users for some endpoints by attaching null user
      // or return 401 if strict. We will set req.user to null instead of erroring,
      // so endpoints can decide if they require a user.
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  })(req, res, next);
};

const requireAuth = (req, res, next) => {
  authenticateJWT(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
};

module.exports = { authenticateJWT, requireAuth };
