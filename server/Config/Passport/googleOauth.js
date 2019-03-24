const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys= require('../Credintials/keys');

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/api/auth/google/callback',
        passReqToCallback: true
}, async  (request,accessToken, refreshToken, profile, done)=>{
//callback function for passport
  return done(null,profile)
}
));

