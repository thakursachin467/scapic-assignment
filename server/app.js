const express= require('express');
const app = express();
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const PORT= process.env.PORT || 5000;
const auth= require('./routes/user/Auth');
const jwt = require('jsonwebtoken');
const Keys= require('./Config/Credintials/keys');
const passportFacebookSetup= require('./Config/Passport/facebookOauth');
const passportGoogleSetup= require('./Config/Passport/googleOauth');


app.use((request,response,next)=>{
    const authHeader= request.get('Authorization');
    if(authHeader){
        const token= authHeader.split(' ')[1];
        const verification= jwt.verify(token,Keys.secretOrKey);
        request.userId= verification.userId;
    }
    next()
});

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
//passport config
require('./Config/Passport/jwtStrategy')(passport);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

mongoose.connect(`mongodb://admin:admin12@ds159880.mlab.com:59880/scapic`)
    .then(()=>console.log(`connection to database success`))
    .catch(((err)=>console.log(`connection failed to database ${err}`)));

app.use('/api/auth/',auth);
app.listen(PORT,()=>{
    console.log(`APPLICATION STARTED ON PORT ${PORT}`);
});