const asynchandler = require('express-async-handler')
const Category = require('../models/Category')
const ErrorResponse = require('../utils/ErrorResponse');
const Ad = require('../models/Ad');

const getCategories = asynchandler(async (req, res, next) => {
    const categories = await Category.find()
    res.status(200).json(categories )
})

  
const setCategory = asynchandler(async (req, res, next) => {
    const newCat = new Category(req.body);
    await newCat.save();
    res.status(201).json({ message: "Category added" });
})




module.exports = {
    getCategories,setCategory
}