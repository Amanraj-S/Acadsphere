const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Utility to generate a unique username similarly used in passportSetup.js
const generateUsername = async (name) => {
  let usernameBase = name.trim().toLowerCase().replace(/\s+/g, '');
  let username = usernameBase + Math.floor(Math.random() * 10000);

  // Ensure username uniqueness by checking DB
  while (await User.findOne({ username })) {
    username = usernameBase + Math.floor(Math.random() * 10000);
  }
  return username;
};


exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const username = await generateUsername(name);

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, username });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// (Legacy) Simulated Google Login - not recommended if using Passport OAuth properly
exports.googleLogin = async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // Generate a unique username for Google user as well
      const username = await generateUsername(name);
      // Create Google user with dummy password and unique username
      user = await User.create({ name, email, username, password: 'google_oauth_dummy' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
