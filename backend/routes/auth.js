const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Identify or create a user by email, return JWT
router.post('/identify', async (req, res) => {
  const { email, name } = req.body || {};
  console.log('[auth] identify request body:', req.body);
  if (!email) return res.status(400).json({ error: 'email required' });

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('auth identify error', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
