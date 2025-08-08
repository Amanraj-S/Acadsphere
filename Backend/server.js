require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');

// Load passport config
require('./config/passportSetup');

const app = express();

// Helper to mount routes with logging
function safeUseRoute(mountPath, routePath, appInstance) {
  try {
    const router = require(routePath);
    appInstance.use(mountPath, router);
    console.log(`✅ Mounted ${routePath} at ${mountPath}`);
  } catch (err) {
    console.error(`❌ Failed to mount ${routePath} at ${mountPath}`);
    console.error(err);
  }
}

(async () => {
  try {
    await connectDB();
    console.log('✅ Database connected');

    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://acadsphere.vercel.app';

    // Middleware
    app.use(cors({ origin: FRONTEND_URL, credentials: true }));
    app.use(express.json());
    app.use(passport.initialize());

    // API Routes
    safeUseRoute('/api/auth', './routes/authRoutes', app);
    safeUseRoute('/api/college', './routes/collegeRoutes', app);
    safeUseRoute('/api/school', './routes/schoolRoutes', app);

    // Serve frontend SPA in production
    if (process.env.NODE_ENV === 'production') {
      const frontendPath = path.join(__dirname, '../frontend/dist');
      app.use(express.static(frontendPath));

      // Catch-all for SPA routing
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }

    // API 404 fallback
    app.use((req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ message: 'Route not found' });
      }
      next();
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (ENV: ${process.env.NODE_ENV})`);
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
})();
