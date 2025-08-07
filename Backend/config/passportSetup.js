const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Helper to generate unique username
const generateUsername = (name) => {
  return (
    name.trim().toLowerCase().replace(/\s+/g, '') +
    Math.floor(Math.random() * 10000)
  );
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const displayName = profile.displayName || 'user';
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';

          let finalUsername = generateUsername(displayName);
          while (await User.findOne({ username: finalUsername })) {
            finalUsername = generateUsername(displayName);
          }

          user = await User.create({
            googleId: profile.id,
            name: displayName,
            email,
            username: finalUsername,
            password: 'google_oauth_dummy', // make password optional in User schema
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
