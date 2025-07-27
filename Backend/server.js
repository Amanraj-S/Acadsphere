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

// Connect to MongoDB and start server
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
      secret: process.env.JWT_SECRET || 'defaultsecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // true if using HTTPS in production
        httpOnly: true
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // API Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/college', require('./routes/collegeRoutes'));
    app.use('/api/school', require('./routes/schoolRoutes'));
    // Optional: additional label-based delete route
    // app.use('/api/semester', require('./routes/semesterRoutes')); ❌ REMOVE this if using unified collegeRoutes.js

    // Serve frontend in production
    if (process.env.NODE_ENV === 'production') {
      const frontendPath = path.join(__dirname, '../frontend/dist');
      app.use(express.static(frontendPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();
