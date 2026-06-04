const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');

const googleAuthEnabled = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

// Register / Login / Logout (JWT-based)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Preserve Google OAuth routes (disabled safely if creds missing)
router.get('/login', (req, res) => {
  return res.json({
    message: googleAuthEnabled
      ? 'Redirecting to Google login'
      : 'OAuth is disabled in this deployment',
    loginUrl: googleAuthEnabled ? '/auth/google' : null,
  });
});

router.get('/google', (req, res, next) => {
  if (!googleAuthEnabled) {
    return res.status(503).json({ error: 'Google OAuth is disabled' });
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!googleAuthEnabled) {
    return res.status(503).json({ error: 'Google OAuth is disabled' });
  }
  return passport.authenticate('google', { failureRedirect: '/?error=auth_failed' })(req, res, next);
}, (req, res) => {
  res.redirect('/?authenticated=true');
});

router.get('/profile', (req, res) => {
  if (!googleAuthEnabled || !req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({
    id: req.user.id,
    displayName: req.user.displayName,
    email: req.user.email,
    profileImage: req.user.profileImage,
  });
});

module.exports = router;
