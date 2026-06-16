const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required for token verification');
  }
  return process.env.JWT_SECRET;
};

const verifyJwtToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  const authorization = req.headers.authorization || req.headers.Authorization;
  if (authorization) {
    const token = authorization.startsWith('Bearer ')
      ? authorization.slice(7).trim()
      : authorization.trim();

    try {
      const user = verifyJwtToken(token);
      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  return res.status(401).json({ error: 'Unauthorized - login required' });
};

module.exports = isAuthenticated;
