const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Helper function to generate username
const generateUsername = (name) => {
  return (
    name.trim().toLowerCase().replace(/\s+/g, '') +
    Math.floor(Math.random() * 10000)
  );
};

// Signup POST
router.post('/signup', async (req, res) => {
  const { name, email, password, username } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, ...(username ? [{ username }] : [])],
    });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let finalUsername = username;

    if (!finalUsername) {
      let unique = false;
      while (!unique) {
        const temp = generateUsername(name);
        const exists = await User.findOne({ username: temp });
        if (!exists) {
          finalUsername = temp;
          unique = true;
        }
      }
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      username: finalUsername,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '7d' });

    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '7d' });

    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '7d' });

    const frontendRedirectUrl = `https://acadsphere.vercel.app/oauth-handler?token=${token}&name=${encodeURIComponent(req.user.name)}`;
    res.redirect(frontendRedirectUrl);
  }
);

// Legacy Google login POST (optional)
router.post('/google', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      let finalUsername = generateUsername(name);
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = generateUsername(name);
      }

      user = await User.create({
        name,
        email,
        username: finalUsername,
        password: 'google_oauth_dummy',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '7d' });

    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Server error during Google login' });
  }
});

module.exports = router;
