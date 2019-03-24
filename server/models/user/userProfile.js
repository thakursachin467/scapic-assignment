const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userProfile = new Schema({
    email:{
        type: String,
        required: true
    },
    name:{
      firstName:{
          type:String,
          required: true
      },
        lastName:{
          type: String
        }
    },
    password:{
        type: String,
        required: true
    },
    is_deactive:{
        type: Boolean,
        default: false
    },
    phone:{
        type: String
    },
    facebook:{
        token : String,
        email: {
            type: String
        },
        display_picture:{
            type: String
        }
    },
    google:{
        token : String,
        email: {
            type: String
        },
        display_picture:{
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

UserProfiles.getUsers= (filter)=>{
  const query =   UserProfiles.find(filter).lean();
  query.exec((error,result)=>{
      if (error){
          return error
      }
      return result;
  });
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


UserProfiles.editUser = async  (filter,update,options)=>{
      const query = UserProfiles.findOneAndUpdate(filter,{$set:update},options).lean();
      query.exec((error,result)=>{
         console.log(result);
      });
};




module.exports= UserProfiles;


