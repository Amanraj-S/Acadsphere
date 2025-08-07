// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');

require('./config/passportSetup');

const app = express();

function safeUseRoute(mountPath, routePath, appInstance) {
  try {
    const r = require(routePath);
    // Basic validation: router should be function (express Router is a function)
    if (!r || (typeof r !== 'function' && typeof r !== 'object')) {
      console.warn(`[WARN] Route module ${routePath} did not export a router.`);
    }
    appInstance.use(mountPath, r);
    console.log(`Mounted ${routePath} at ${mountPath}`);
  } catch (err) {
    // Attach routePath to error for easier debugging
    console.error(`❌ Failed to mount route file: ${routePath} (mount at ${mountPath})`);
    console.error(err && err.stack ? err.stack : err);
    // Re-throw so startup will fail OR comment out rethrow to continue (choose one)
    throw err;
  }
}

(async () => {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected.');

    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://acadsphere.vercel.app';

    app.use(
      cors({
        origin: FRONTEND_URL,
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(passport.initialize());

    // Use safe loader so we get precise errors
    safeUseRoute('/api/auth', './routes/authRoutes', app);
    safeUseRoute('/api/college', './routes/collegeRoutes', app);
    safeUseRoute('/api/school', './routes/schoolRoutes', app);

    if (process.env.NODE_ENV === 'production') {
      const frontendPath = path.join(__dirname, '../frontend/dist');
      app.use(express.static(frontendPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }

    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT} (ENV: ${process.env.NODE_ENV || 'development'})`)
    );

    const shutdown = (reason) => {
      console.warn('Shutting down server:', reason);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(1);
      });
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

    module.exports = app;
  } catch (err) {
    console.error('❌ Failed to start server:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
