// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

// Start Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user;

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Redirect to frontend with token as query param
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

module.exports = router;
