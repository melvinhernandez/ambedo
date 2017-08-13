/* Configuring our passport settings. */
const LocalStrategy = require('passport-local');
const User          = require('./models/user/model');
const SpotifyStrategy = require('passport-spotify').Strategy;
const signInWithSpotify = require('./models/user/controller').signInWithSpotify;

const passportConfiguration = (passport) => {

  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });

  /* Passport-Spotify strategy for OAuth. */
  passport.use(new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/spotify/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      signInWithSpotify(profile, accessToken, refreshToken).then(
        (user) => {
          console.log("Signed in successfully!");
          done(null, user);
        },
        (error) => {
          console.log("There was an error after trying to sign in.");
          done(error);
        }
      );
    });
  }));
}

module.exports = passportConfiguration;
