const express = require('express');
const router = express.Router();
const passport = require('passport');

const googleAuthEnabled = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

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

router.get('/logout', (req, res) => {
  if (!req.logout) {
    return res.status(503).json({ error: 'Logout is unavailable' });
  }
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
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
