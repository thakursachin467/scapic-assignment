const express = require('express');
const router = express.Router();
const user= require('../../controllers/user/user');
const passport = require('passport')

router
    .route('/login')
    .post(user.LoginUser);

router
    .route('/signup')
    .post(user.AddUser);

router
    .route('/google')
    .get(passport.authenticate('google',{
        scope:['profile','email']
    }));

router
    .route('/google/callback')
    .get(passport.authenticate('google'),user.googleOauth);


router
    .route('/facebook')
    .get(passport.authenticate('facebook' ));

router
    .route('/facebook/callback')
    .get(passport.authenticate('facebook'),user.facebookOauth);

module.exports= router;
