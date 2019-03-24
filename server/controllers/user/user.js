const User = require('../../models/user/userProfile');
const _ = require('lodash');
const bcrypt= require('bcryptjs');
const LoginValidation= require('../../Utils/LoginValidation');
const SignupValidation = require('../../Utils/SignupValidation');



exports.LoginUser= async (request,response,next)=>{
        response.send('login user');
    };

exports.AddUser=async (request,response,next)=>{
    const user= {
        email: _.get(request,'body.email'),
        name:{
            firstName: _.get(request,'body.firstName'),
            lastName: _.get(request,'body.lastName')
        },
        password: _.get(request,'body.password'),
        rePassword: _.get(request,'body.rePassword'),
        phone: _.toString(_.get(request,'body.phone'))
    };
  const Validation=  SignupValidation(user);
  if(!Validation.isValid){
      response
          .status(400)
          .send({
              success:false,
              errors: Validation.errors
          })
  };
    delete user.rePassword;
    const   hashedPassword= await bcrypt.hash(user.password,12);
    user.password= hashedPassword;
   const saveUser= await User.addUser(user);
   console.log(saveUser);
   try{
        response
            .status(200)
            .send({
                status:true,
                body:saveUser
            })
   }catch (error) {
       response
           .status(500)
           .send({
               success: false,
               error:error
           })
   }
};


