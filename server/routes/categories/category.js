const express = require('express');
const router = express.Router();
const Category= require('../../controllers/categories/category');
const passport = require('passport')


router
    .route('/')
    .post(Category.addCategory);

router
    .route('/all')
    .get(Category.getCategories);

router
    .route('/:category_id/models')
    .get(Category.getModels);

router
    .route('/:category_id/models')
    .post(Category.addModel);


module.exports= router;