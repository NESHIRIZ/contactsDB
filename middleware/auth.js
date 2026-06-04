const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  console.log('AUTH HEADER:', authHeader);

  // Accept formats like: "Bearer <token>" or just the token
  let token = null;
  if (!authHeader) {
    console.log('No authorization header present');
    return res.status(401).json({ error: 'Unauthorized - missing Authorization header' });
  }

  const parts = authHeader.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    token = parts[1];
  } else if (parts.length === 1) {
    token = parts[0];
  } else {
    console.log('Authorization header malformed:', authHeader);
    return res.status(401).json({ error: 'Unauthorized - malformed Authorization header' });
  }

  console.log('EXTRACTED TOKEN:', token && token.substring(0, 8) + '...');

  try {
    const payload = jwt.verify(token, getJwtSecret());
    console.log('JWT verify success. Payload:', payload);
    req.user = payload;
    return next();
  } catch (err) {
    console.error('JWT verify error:', err && err.message);
    return res.status(401).json({ error: 'Unauthorized - invalid token', details: err && err.message });
  }
};

module.exports = authenticate;
