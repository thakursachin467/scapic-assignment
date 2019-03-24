const User = require('../../models/user/userProfile');
const _ = require('lodash');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const LoginValidation= require('../../Utils/LoginValidation');
const SignupValidation = require('../../Utils/SignupValidation');

exports.LoginUser= async (request,response,next)=>{
       const user= {
           email: _.get(request,'body.email'),
           password: _.get(request,'body.password')
       };
       const Validation = LoginValidation(user);
       if(!Validation.isValid){
           return response
               .status(401)
               .send({
                   success:false,
                   errors: Validation.errors
               })
       }
       const filter= {
           email: user.email
       };
       const userProfile= await User.getUser(filter);
       if(_.isEmpty(userProfile)){
           return response
               .status(401)
               .send({
                   success: false,
                   errors:{
                       email:'Email does not exist'
                   }
               })
       }
       const isPresent= await bcrypt.compare(user.password,userProfile.password);
       if(!isPresent){
           return response
               .status(401)
               .send({
                   success: false,
                   errors:{
                       password: 'Password is incorrect.'
                   }
               })
       }
    const token=await jwt.sign({userId:user.id,email:user.email},'oursecretkey',{expiresIn: '1hr'});
       const body={
           email: userProfile.email,
           firstName: userProfile.name.firstName,
           lastName: userProfile.name.lastName,
           token,
           phone: userProfile.phone

       };
       return response
           .status(200)
           .send({
               success: true,
               body
           })
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
    return  response
          .status(400)
          .send({
              success:false,
              errors: Validation.errors
          });
  }
  //to check weather we have already registered with the email with any of our signup methods
    const filter= {
      $or:[
          {
              email: user.email,
              is_deactive: false
          },
          {
              "facebook.email": user.email,
              is_deactive: false
          },
          {
              "google.email": user.email,
              is_deactive: false
          },
          {
              "github.email": user.email,
              is_deactive: false
          }
      ]
    };
    const userFound= await User.getUser(filter);
    if(!_.isEmpty(userFound) ){
      return  response
            .status(400)
            .send({
                success: false,
                errors:{
                    email: 'User already exists with this email'
                }
            });
    }
    delete user.rePassword;
    const   hashedPassword= await bcrypt.hash(user.password,12);
    user.password= hashedPassword;
   const saveUser= await User.addUser(user);
   try{
       const body= {
           firstName: saveUser.name.firstName,
           lastName:  saveUser.name.lastName,
           email: saveUser.email,
           role: saveUser.role,
           phone: saveUser.phone,
           _id: saveUser._id
       };
      return  response
            .status(200)
            .send({
                status:true,
                body
            })
   }catch (error) {
     return  response
           .status(500)
           .send({
               success: false,
               error:error
           });
   }
};


