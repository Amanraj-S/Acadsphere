// Load environment variables immediately
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');

// Now import passport setup after environment variables are loaded
require('./config/passportSetup');

const app = express();

(async () => {
  try {
    await connectDB();

    app.use(cors({
      origin: 'https://acadsphere.vercel.app/',
      credentials: true, // If cookies used, optional for JWT only
    }));

    app.use(express.json());

    // Remove session middleware as JWT is stateless
    // If needed later, uncomment and configure sessions and passport.session()

    app.use(passport.initialize());

    // Mount API routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/college', require('./routes/collegeRoutes'));
    app.use('/api/school', require('./routes/schoolRoutes'));

    // Serve frontend build files in production
    if (process.env.NODE_ENV === 'production') {
      const frontendPath = path.join(__dirname, '../frontend/dist');
      app.use(express.static(frontendPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }

    // 404 handler for unknown routes
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Optional: Global error handler middleware (if you have it)
    // const { errorHandler } = require('./middleware/errorMiddleware');
    // app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();
