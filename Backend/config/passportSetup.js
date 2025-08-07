const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Helper to generate a unique username based on user's name plus random suffix
const generateUsername = (name) => {
  return (
    name.trim().toLowerCase().replace(/\s+/g, '') +
    Math.floor(Math.random() * 10000)
  );
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,       // Must be set in .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Must be set in .env
      callbackURL: '/api/auth/google/callback',     // Must match Google Cloud Console settings
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Attempt to find existing user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Extract info safely
          const displayName = profile.displayName || 'user';
          const email =
            profile.emails && profile.emails[0] ? profile.emails[0].value : '';

          // Generate unique username and ensure it's unique
          let finalUsername = generateUsername(displayName);
          while (await User.findOne({ username: finalUsername })) {
            finalUsername = generateUsername(displayName);
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: displayName,
            email,
            username: finalUsername,
            password: 'google_oauth_dummy', // Dummy password, make password optional in schema
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
