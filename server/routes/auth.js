const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate tokens
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to user
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.json({
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email }
    });
    
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ token: newToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;
