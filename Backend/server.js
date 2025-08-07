// server.js
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
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected.');

    // CORS: allow frontend origin from env or default to your vercel app
    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://acadsphere.vercel.app';

    app.use(
      cors({
        origin: FRONTEND_URL,
        credentials: true, // enable cookies if needed
      })
    );

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

      // If the frontend build exists, serve index.html for all unmatched routes
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }

    // 404 handler (for API routes)
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Optional global error handler
    // const { errorHandler } = require('./middleware/errorMiddleware');
    // app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT} (ENV: ${process.env.NODE_ENV || 'development'})`)
    );

    // Graceful shutdown handlers
    const shutdown = (reason) => {
      console.warn('Shutting down server:', reason);
      server.close(() => {
        console.log('HTTP server closed.');
        // if you have DB connection close logic, call it here
        process.exit(1);
      });

      // Force exit if still not closed after 10s
      setTimeout(() => {
        console.error('Forcing shutdown...');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('unhandledRejection');
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception thrown:', err);
      shutdown('uncaughtException');
    });

    process.on('SIGTERM', () => {
      console.info('SIGTERM received — shutting down gracefully.');
      server.close(() => {
        console.log('Process terminated');
      });
    });

    // Export server for tests (if needed)
    module.exports = app;
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    // Ensure the process exits with failure so Render can retry / show error
    process.exit(1);
  }
})();
