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

  if (!authHeader) {
    console.log('No authorization header present');
    return res.status(401).json({ error: 'Unauthorized - missing Authorization header' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    console.log('Authorization header malformed:', authHeader);
    return res.status(401).json({ error: 'Unauthorized - malformed Authorization header. Expected "Bearer <token>"' });
  }

  const token = parts[1];
  console.log('TOKEN:', token ? `${token.substring(0, 16)}...` : token);

  try {
    const payload = jwt.verify(token, getJwtSecret());
    console.log('JWT PAYLOAD:', payload);
    req.user = payload;
    return next();
  } catch (err) {
    console.error('JWT ERROR:', err.name, err.message);
    return res.status(401).json({ error: 'Unauthorized - invalid token', details: err.message });
  }
};

module.exports = authenticate;
