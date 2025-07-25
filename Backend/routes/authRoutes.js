const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Utility to generate fallback username
const generateUsername = (name) => {
  return (
    name.trim().toLowerCase().replace(/\s+/g, '') +
    Math.floor(Math.random() * 10000)
  );
};

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, username } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, ...(username ? [{ username }] : [])],
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let finalUsername = username;

    if (!finalUsername) {
      // Generate a unique username
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', {
      expiresIn: '7d',
    });

    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', {
      expiresIn: '7d',
    });

    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists
      let finalUsername = generateUsername(name);
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = generateUsername(name);
      }

      user = await User.create({
        name,
        email,
        username: finalUsername,
        password: 'google_oauth_dummy', // not used
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', {
      expiresIn: '7d',
    });

    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Server error during Google login' });
  }
});

module.exports = router;
