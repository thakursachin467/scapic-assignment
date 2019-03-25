const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const _ = require('lodash');
const {ObjectId}= Schema;
const Sentry = require('@sentry/node');
const modelSchema= new Schema({
    name:{
        type: ObjectId,
        ref:'categories'
    },
    model: {
            name:{
                type: String
            },
            mtl:{
                type: String
            },
            obj:{
                type: String
            },
            thumb:{
                type: String
            }
        }

});

const Model= mongoose.model('models',modelSchema);

Model.getModels = async  ({filter,limit,skip,populate})=>{
  const modelItems= await  Model.find(filter).skip(skip).limit(limit).populate(populate).lean().exec();
  modelItems.count= await Model.count(filter).lean().exec()
  try{
      return modelItems;
  }catch (error) {
      Sentry.captureException(error);
      return error;
  }
};

Model.addModel=async (params)=>{
    const modelItem = new Model(params);
    const result=await modelItem.save();
    try{
        return result;
    }catch (error) {
        Sentry.captureException(error);
        return error;
    }
};


module.exports= Model;