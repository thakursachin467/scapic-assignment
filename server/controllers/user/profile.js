const User = require('../../models/user/userProfile');
const _ = require('lodash');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const LoginValidation= require('../../Utils/LoginValidation');
const SignupValidation = require('../../Utils/SignupValidation');
const Sentry = require('@sentry/node');

exports.deactivateUser=async (request,response,next)=>{
    const user_id= request.userId;
    const filter= {
        _id:user_id
    };
    const update= {
        is_deactive: true
    };
    const userProfile=await User.editUser(filter,update);
    try{
        if(!_.isUndefined(userProfile)) {
            return response
                .status(200)
                .send({
                    success: true,
                    body: {},
                    message:{
                        message: 'Successfully removed user profile'
                    }
                })
        }
        return response
            .status(500)
            .send({
                success: false,
                body: {},
                message:{
                    message:'Internal Server error'
                }
            })

    }catch (error) {
        Sentry.captureException(error);
        return response
            .status(500)
            .send({
                success:false,
                body:{},
                message:{
                    message:'Internal Server error'
                }

            })
    }
};


exports.getUserProfile = async (request,response,next)=>{
    let profile_id= _.get(request,'params.profile_id');
    (profile_id==='myprofile')? profile_id = _.get(request,'userId'):'';
    const filter={
        _id:profile_id
    };
    const profile= await User.getUser(filter);
    try{
        if(_.isUndefined(profile)){
            return response
                .status(500)
                .send({
                    success:false,
                    body:{
                        message:'Sorry! Something went wrong'
                    }
                })
        }
        const body={
            _id: _.get(profile._id),
            name:profile.name,
            email:_.get(profile,'email'),
            google:{
                isLinked:!_.isUndefined(profile.google),
                email:_.get(profile,'google.email'),
                display_picture: _.get(profile,'google.display_picture')
            },
            facebook:{
                isLinked:!_.isUndefined(profile.facebook),
                email:_.get(profile,'facebook.email'),
                display_picture: _.get(profile,'facebook.display_picture')
            }
        };

        return response
            .status(200)
            .send({
                success: true,
                body,
                message:{
                    message:'Profiles successfully retrived'
                }
            })

    }catch (error) {
        Sentry.captureException(error);
        return response
            .status(500)
            .send({
                success:false,
                body:{},
                message:{
                    message:'Sorry! Something went wrong.'
                }
            })
    }

};

exports.getUserProfiles=async (request,response,next)=>{
    const limit= _.toNumber(_.get(request,'query.limit') || 24) ;
    const skip= _.toNumber(_.get(request,'query.skip') || 0);
  const user_profiles= await User.getUsers({limit,skip});
  try{
     const body= user_profiles.map(user=>{
            return {
                _id:_.get(user,'_id'),
                role:_.get(user,'role'),
                name:_.get(user,'name'),
                email:_.get(user,'email'),
                google:{
                    isLinked:!_.isUndefined(user.google),
                    email:_.get(user,'google.email'),
                    display_picture: _.get(user,'google.display_picture')
                },
                facebook:{
                    isLinked:!_.isUndefined(user.facebook),
                    email:_.get(user,'facebook.email'),
                    display_picture: _.get(user,'facebook.display_picture')
                }
            }
      });
     response
         .status(200)
         .send({
             pagination:{
               count: body.length
             },
             success: true,
             body,
             message:{
                 message:'All profiles retrieved successfully'
             }
         })
  }catch (error) {
      Sentry.captureException(error);
      return response
          .status(500)
          .send({
              success:false,
              body:[],
              message:{
                  message:'Sorry! Something went wrong.'
              }
          })
  }
};