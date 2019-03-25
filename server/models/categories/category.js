const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const _ = require('lodash');
const Sentry= require('@sentry/node');
const categorySchema= new Schema({
   name:{
       type:String,
       required: true
   },
});

const Category= mongoose.model('categories',categorySchema);

Category.addCategory = async  ({filter,update={},options={}})=>{
  const categoryItem=await Category.findOneAndUpdate(filter,update,options);
  try{
      return categoryItem;
  }catch (error) {
      Sentry.captureException(error);
      return error;
  }
};

Category.getAllCategory=async ({filter={},limit,skip,select,sort}) =>{
 const category= await Category.find(filter).select(select).sort(sort).skip(skip).limit(limit).lean().exec();
 category.count= await  Category.count().lean().exec();
 try{
  return category;
 }catch (error) {
     Sentry.captureException(error);
     return error;
 }
};



module.exports= Category;