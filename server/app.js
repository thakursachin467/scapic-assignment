const express= require('express');
const app = express();
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const PORT= process.env.PORT || 5000;
const auth= require('./routes/user/Auth');


//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-itdbo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(()=>console.log(`connection to database success`))
    .catch(((err)=>console.log(`connection failed to database ${err}`)));

app.use('/api/auth/',auth);
app.listen(PORT,()=>{
    console.log(`APPLICATION STARTED ON PORT ${PORT}`);
});