const express = require('express');
const router = express.Router();
const Profile= require('../../controllers/user/profile');
const passport = require('passport')


router
    .route('/')
    .get(Profile.getUserProfiles);


router
    .route('/:profile_id')
    .get(Profile.getUserProfile);

router
    .route('/delete')
    .get(Profile.deactivateUser);




module.exports= router;