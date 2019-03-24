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
                   message: Validation.errors
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
                   message:{
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
                   message:{
                       password: 'Password is incorrect.'
                   }
               })
       }
    const token=await jwt.sign({userId:userProfile._id,email:userProfile.email},'oursecretkey');
       const body={
           _id:userProfile._id,
           email: userProfile.email,
           firstName: userProfile.name.firstName,
           lastName: userProfile.name.lastName,
           token:`Bearer ${token}`,
           phone: userProfile.phone
       };
       return response
           .status(200)
           .send({
               success: true,
               body,
               message:{
                   message:'Login Successful'
               }
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
              message: Validation.errors
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
                message:{
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
           _id: saveUser._id,
       };
      return  response
            .status(200)
            .send({
                status:true,
                body,
                message:{
                    message:'Successfully created profile'
                }
            })
   }catch (error) {
     return  response
           .status(500)
           .send({
               success: false,
               message:error
           });
   }
};



exports.googleOauth=async (request,response,next)=>{
    const profile= _.get(request,'user');
    const user_id=  _.get(request,'UserId');
    if(user_id){
        const filter= {
            _id: user_id
        };
        const update= {
            "google.email": profile.email,
            "google.id": profile.id,
            "google.display_picture": _.get(profile,'photos[0].value')
        };
       const result= await User.editUser(filter,update);
        try{
            return response
                .status(200)
                .send({
                success: true,
                message:{
                   message:'Account Successfully Linked'
                }
            })
        }catch (error) {
            return response
                .status(500)
                .send({
                success: false,
                message:{
                    message:'Some error occured.'
                }
            })
        }

    }else{
        const user= {
            name:{
                firstName: _.get(profile,'name.givenName'),
                lastName:_.get(profile,'name.familyName')
            },
            google:{
                "email": _.get(profile,'emails[0].value'),
                "id": profile.id,
                "display_picture":_.get(profile,'photos[0].value')
            }
        };
        const filter={
            "google.id": profile.id,
            "is_deactive":false
        };
        const existingUser= await User.getUser(filter);
        if(!existingUser){
          const result= await User.addUser(user);
          try{
              const token= await jwt.sign({userId:result._id,email:result.google.email},'oursecretkey');
              const body= {
                  email: _.get(result,'google.email',''),
                  _id:_.get(result,'_id'),
                  firstName: _.get(result,'name.firstName',''),
                  lastName: _.get(result,'name.lastName',''),
                  token:`Bearer ${token}`,
                  phone: _.get(result,'phone',''),

              };
              return response
                  .status(200)
                  .send({
                      success: true,
                      body,
                      message:{
                          message:'Successfully Linked with google account'
                      }
                  })
          }catch (error) {
              return response
                  .status(500)
                  .send({
                      success: false,
                      message:{
                          message: 'Internal Server error'
                      }
                  })
          }
        }
        const token= await jwt.sign({userId:existingUser._id,email:existingUser.google.email},'oursecretkey');
        const body= {
            email: _.get(existingUser,'google.email',''),
            _id:_.get(existingUser,'_id'),
            firstName: _.get(existingUser,'name.firstName',''),
            lastName: _.get(existingUser,'name.lastName',''),
            token:`Bearer ${token}`,
            phone: _.get(existingUser,'phone',''),
            message:'Successfully Linked with google account'

        };
        return response
            .status(200)
            .send({
                success: true,
                body,
                message:{
                    message:'Successfully Linked with google account'
                }
            })
    }
};


exports.facebookOauth = async  (request,response,next)=>{
    const profile= _.get(request,'user');
    const user_id=  _.get(request,'UserId');
    if(user_id){
        const filter= {
            _id: user_id
        };
        const update= {
            "facebook.email": profile.email,
            "facebook.id": profile.id,
        };
        const result= await User.editUser(filter,update);
        try{
            return response
                .status(200)
                .send({
                    success: true,
                    message:{
                        message:'Account Successfully Linked',
                    }
                })
        }catch (error) {
            return response
                .status(500)
                .send({
                    success: false,
                    message:{
                        message:'Some error occured.'
                    }
                })
        }

    }else{
        const user= {
            name:{
                firstName: _.split(_.get(profile,'displayName'),' ',2)[0] ,
                lastName:_.split(_.get(profile,'displayName'),' ',2)[1]
            },
            facebook:{
                "email": profile.email,
                "id": profile.id,
            }
        };
        const filter={
            "facebook.id": profile.id,
            "is_deactive":false
        };
        const existingUser= await User.getUser(filter);
        if(!existingUser){
            const result= await User.addUser(user);
            try{
                const token= await jwt.sign({userId:result._id,email:result.google.email},'oursecretkey');
                const body= {
                    email: _.get(result,'facebook.email',''),
                    _id:_.get(result,'_id'),
                    firstName: _.get(result,'name.firstName',''),
                    lastName: _.get(result,'name.lastName',''),
                    token:`Bearer ${token}`,
                    phone: _.get(result,'phone',''),

                };
                return response
                    .status(200)
                    .send({
                        success: true,
                        body,
                        message:{
                            message:'Successfully Linked with Facebook account'
                        }
                    })
            }catch (error) {
                return response
                    .status(500)
                    .send({
                        success: false,
                        body:{},
                        message:{
                            message: 'Internal Server error'
                        }
                    })
            }
        }
        const token= await jwt.sign({userId:existingUser._id,email:existingUser.facebook.email},'oursecretkey');
        const body= {
            email: _.get(existingUser,'facebook.email',''),
            _id:_.get(existingUser,'_id'),
            firstName: _.get(existingUser,'name.firstName',''),
            lastName: _.get(existingUser,'name.lastName',''),
            token:`Bearer ${token}`,
            phone: _.get(existingUser,'phone',''),

        };
        return response
            .status(200)
            .send({
                success: true,
                body,
                message:{
                    message:'Successfully logged in  with Facebook'
                }
            })
    }

};



