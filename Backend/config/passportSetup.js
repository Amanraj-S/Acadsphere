const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`, // MUST MATCH Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.displayName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 10000),
            password: 'google_oauth_dummy',
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
