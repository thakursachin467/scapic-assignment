const jwtStrategy = require('passport-jwt').Strategy;
const Extractjwt = require('passport-jwt').ExtractJwt;
const User= require('../../models/user/userProfile');
const Keys = require('../Credintials/keys');

const opts = {}

opts.jwtFromRequest = Extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Keys.secretOrKey;

module.exports = async passport => {
    passport.use(new jwtStrategy(opts,async (jwt_payload, done) => {
        const filter= {
            _id: jwt_payload._id
        };
       const user= await User.getUser(filter);
       if(user){
           return done(null, user);
       }
       return done(null, false);
    }));
};