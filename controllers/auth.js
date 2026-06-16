const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
};

const register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: 'User with that email or username already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, displayName });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });

    console.log('Auth login: generated token for user', user._id ? user._id.toString() : user.email, token.substring(0, 16) + '...');
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const logout = async (req, res) => {
  try {
    if (req.logout) {
      return req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }

        if (req.session) {
          req.session.destroy(() => {});
        }

        return res.status(200).json({ message: 'Logged out' });
      });
    }

    if (req.session) {
      req.session.destroy(() => {});
    }

    return res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Logout failed' });
  }
};

module.exports = {
  register,
  login,
  logout,
};
