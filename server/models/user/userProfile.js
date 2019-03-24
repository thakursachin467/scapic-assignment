const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const _ = require('lodash');
const userProfile = new Schema({
    email:{
        type: String
    },
    name:{
      firstName:{
          type:String
      },
        lastName:{
          type: String
        }
    },
    password:{
        type: String
    },
    is_deactive:{
        type: Boolean,
        default: false
    },
    phone:{
        type: String
    },
    facebook:{
        id : {
            type:String
        },
        email: {
            type: String
        },
        display_picture:{
            type: String
        }
    },
    google:{
        email: {
            type: String
        },
        display_picture:{
            type: String
        },
        id:{
            type: String
        }
    },
    github:{
        token : String,
        email: {
            type: String
        },
        display_picture:{
            type: String
        }
    },
    role: {
        type: String,
        default: 'user'
    },
}, {
    timestamps: { createdAt: 'created_on', updatedAt: 'modified_on' },
    autoIndex: false
});

const UserProfiles = mongoose.model('userProfiles', userProfile);


UserProfiles.getUser=async (filter)=>{
   const query= await UserProfiles.findOne(filter).lean().exec();
   try{
       return query;
   }catch (error) {
       return error;
   }

};

UserProfiles.getUsers=async ({filter={},limit,skip})=>{
  const query =await  UserProfiles.find(filter).lean().skip(skip).limit(limit).exec();
  try{
      return query;
  }catch (error) {
      return error;
  }
};

UserProfiles.addUser=async (params)=>{
 const user= new UserProfiles(params);
const result= await user.save();
try{
    return result;
}catch (error) {
    return error;
}

};


UserProfiles.editUser = async  (filter,update,options={})=>{
      const query =await UserProfiles.findOneAndUpdate(filter,{$set:update},options).lean().exec();
      try{
          if(!_.isUndefined(query)) {
              return query;
          }

      }catch (error) {
          return error;
      }
};




module.exports= UserProfiles;


