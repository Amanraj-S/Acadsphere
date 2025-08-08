// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');

// Load passport config
require('./config/passportSetup');

const app = express();

/**
 * Safely mount a route, logging success/failure.
 */
function safeUseRoute(mountPath, routePath, appInstance) {
  try {
    const router = require(routePath);

    if (!router || (typeof router !== 'function' && typeof router !== 'object')) {
      console.warn(`[WARN] Route module ${routePath} did not export a valid router.`);
    }

    appInstance.use(mountPath, router);
    console.log(`✅ Mounted ${routePath} at ${mountPath}`);
  } catch (err) {
    console.error(`❌ Failed to mount route file: ${routePath} (mount at ${mountPath})`);
    console.error(err.stack || err);
    throw err;
  }
}

(async () => {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected.');

    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://acadsphere.vercel.app';

    // Middleware
    app.use(
      cors({
        origin: FRONTEND_URL,
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(passport.initialize());

    // API Routes
    safeUseRoute('/api/auth', './routes/authRoutes', app);
    safeUseRoute('/api/college', './routes/collegeRoutes', app);
    safeUseRoute('/api/school', './routes/schoolRoutes', app);

    // Serve frontend in production
    if (process.env.NODE_ENV === 'production') {
      const frontendPath = path.join(__dirname, '../frontend/dist');
      app.use(express.static(frontendPath));

      // SPA catch-all (make sure this is INSIDE the if block!)
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }

    // 404 JSON fallback for unmatched API routes
    app.use((req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ message: 'Route not found' });
      }
      next();
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (ENV: ${process.env.NODE_ENV || 'development'})`);
    });

    // Graceful shutdown
    const shutdown = (reason) => {
      console.warn(`⚠️ Shutting down server due to: ${reason}`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(1);
      });
      setTimeout(() => {
        console.error('⏳ Forced shutdown.');
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
        console.log('Process terminated.');
      });
    });

    module.exports = app;
  } catch (err) {
    console.error('❌ Failed to start server:', err.stack || err);
    process.exit(1);
  }
})(); // End of async IIFE
