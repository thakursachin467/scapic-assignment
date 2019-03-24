const  passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const Keys= require('../Credintials/keys');

passport.use(new FacebookStrategy({
        clientID: Keys.facebook.clientID,
        clientSecret:Keys.facebook.clientSecret,
        callbackURL: "/api/auth/facebook/callback",
        passReqToCallback: true
    },(request,accessToken, refreshToken, profile, done) =>{
    return done(null,profile)
    }
));