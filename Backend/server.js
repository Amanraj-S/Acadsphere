// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');

// Load Passport config AFTER env loaded
require('./config/passportSetup');

const app = express();

(async () => {
  try {
    await connectDB();

    app.use(cors({
      origin: 'https://acadsphere.vercel.app', // No trailing slash here
      credentials: true, // Enable cookies if needed
    }));

    app.use(express.json());

    // Passport middleware initialization (no sessions for JWT stateless)
    app.use(passport.initialize());

    // API Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/college', require('./routes/collegeRoutes'));
    app.use('/api/school', require('./routes/schoolRoutes'));

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

    // Optional global error handler (uncomment if using)
    // const { errorHandler } = require('./middleware/errorMiddleware');
    // app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();
