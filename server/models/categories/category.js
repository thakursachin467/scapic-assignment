const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const _ = require('lodash');

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
      return error;
  }
};

Category.getAllCategory=async ({filter={},limit,skip,select}) =>{
 const category= await Category.find(filter).select(select).skip(skip).limit(limit).lean().exec();
 try{
  return category;
 }catch (error) {
     return error;
 }
};



module.exports= Category;