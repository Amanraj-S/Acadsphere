// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');
require('./config/passportSetup');

dotenv.config();
const app = express();

// Connect to DB before starting server
(async () => {
  try {
    await connectDB();

    // Middleware
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true
    }));

    app.use(express.json());

    app.use(session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/college', require('./routes/collegeRoutes'));
    app.use('/api/school', require('./routes/schoolRoutes'));

    // ✅ Serve React frontend for non-API routes (in production)
    if (process.env.NODE_ENV === 'production') {
      const frontendPath = path.join(__dirname, '../frontend/dist');
      app.use(express.static(frontendPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }

    // 404 for unknown API routes (only if not handled above)
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();
