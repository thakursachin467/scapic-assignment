const Category = require('../../models/categories/category');
const _ = require('lodash');
const Model= require('../../models/model/model');
const Sentry = require('@sentry/node');
exports.getCategories=async (request,response,next)=>{
    const select= 'name';
    const limit= _.toNumber(_.get(request,'query.limit')|| 24);
    const skip = _.toNumber(_.get(request,'query.skip') || 0);
    const sort= {
        name:1
    };
    /*the following two specifies how many models should be shown in the preview of each category, if no parameter is
    supplied from frontend  it will by default send 5 models oof each category
    */
   const preview = _.toNumber(_.get(request,'query.preview')||5);
    const skipPreview= _.toNumber(_.get(request,'query.skipPreview')|| 0);
   const categories= await Category.getAllCategory({limit,skip,select,sort});
   try{
       const category_id = categories.map(category=>{
           return _.get(category,'_id')
       });
       const filter={
           name:{
               $in:category_id
           }
       };
       const populate= 'name';
       const models= await Model.getModels({filter,populate});
       const modelItems= await categories.map(category=>{
           const model= models.filter(model=>{
               return _.isEqual( model.name._id,category._id)
           });
           const finalModel= model.map(value=>{
              return {
                  name: value.model.name,
                  mtl:value.model.mtl,
                  obj: value.model.obj,
                  thumb: value.model.thumb
              }
           });
           return {
               _id: category._id,
               name: category.name,
               model:finalModel
           }
       });
       return response
           .status(200)
           .send({
               pagination:{
                   count:categories.count,
                  limit: _.toNumber(_.get(request,'query.limit')|| 24),
                  skip: _.toNumber(_.get(request,'query.skipPreview')|| 0)
               },
               success: true,
               body:modelItems,
               message:{
                   message:'All categories retrieved successfully'
               }
           })
   }catch (error) {
       Sentry.captureException(error);
       console.log(error);
       return response
           .status(500)
           .send({
               success: false,
               body:{},
               message:{
                   message:'Sorry! unfortunately something went wrong'
               }
           })
   }
};


exports.getModels=async (request,response,next)=>{
  const category_id= _.get(request,'params.category_id');
    const select= 'model';
    const limit= _.toNumber(_.get(request,'query.limit')|| 24);
    const skip = _.toNumber(_.get(request,'query.skip') || 0);
    const populate= 'name';
    const filter= {
        name: category_id
    };
    const models= await Model.getModels({filter,limit,skip,select,populate});
    try{
         const modelItems= await models.map(model=>{
             return {
                 name: model.model.name,
                 obj:model.model.obj,
                 mtl:model.model.mtl,
                 thumb: model.model.thumb
             }
         });
         let body ={};
         body.name= _.get(models,'[0].name.name');
         body.models= modelItems;
         return response
             .status(200)
             .send({
                 success: true,
                 body,
                 pagination:{
                     count: modelItems.length,
                     limit,
                     skip
                 },
                 message:{
                     message:'Successfully retrieved all models'
                 }
             });
    }catch (error) {
        Sentry.captureException(error);
        return response
            .status(500)
            .send({
                success: false,
                body:{},
                message:{
                    message:'Sorry! unfortunately something went wrong'
                }
            })
    }

};


exports.addModel= async  (request,response,next)=>{
    const category_id= _.get(request,'params.category_id');
    const {mtl,obj,thumb,name}= _.get(request,'body');
    const params={
        name: category_id,
        model: {
            name,
            mtl,
            obj,
            thumb
        }
    };
    const model= await Model.addModel(params);
    try{
        return response
            .status(200)
            .send({
                success: true,
                body: model,
                message:{
                    message:'Successfully added new model'
                }
            })
    }catch (error) {
        Sentry.captureException(error);
        return response
            .send(500)
            .status({
                success: false,
                body:{},
                message:{
                    message:'Sorry! unfortunately something went wrong'
                }
            })
    }
};



exports.addCategory = async (request,response,next)=>{
    const {name,models}= _.get(request,'body');
    const {mtl,obj,thumb}= models;
    const filter={
        name
    };
    const options={
        upsert:true,
        new: true
    };
    const categoryResult= await Category.addCategory({filter,options});
    try{
        const params={
            name:  categoryResult._id,
            model:  {
                name:_.get(models,'name'),
                mtl,
                obj,
                thumb
            }
        };
        const model= await Model.addModel(params);
       return response
           .status(200)
           .send({
               success: true,
               body: categoryResult,
               message:{
                   message:'Successfully added new category'
               }
           })
    }catch (error) {
        Sentry.captureException(error);
        return response
            .status(500)
            .send({
                success: false,
                body:{},
                message:{
                    message:'Sorry! Something went wrong'
                }
            })
    }
};
