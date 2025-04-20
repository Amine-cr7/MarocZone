
const asynchandler = require('express-async-handler')
const Category = require('../models/Category')
const ErrorResponse = require('../utils/ErrorResponse');
const Ad = require('../models/Ad');
const getTopCat = asynchandler(async (req, res, next) => {
    const categories = await Category.find({parent:null})
    res.status(200).json({ message: "success", count: categories.length, categories })
})
const getSubCat = asynchandler(async (req, res, next) => {
    const subcategories = await Category.find({ parent: req.params.parentId });
    
  
    res.status(200).json({ message: "success",subcategories});
  });
  

const setCategory = asynchandler(async (req, res, next) => {
    const { name, parent } = req.body
    if (!name) {
        return next(new ErrorResponse("name of category is required.", 400));
    }
    const checkCategory = await Category.findOne({ name })
    if(checkCategory){
        return next(new ErrorResponse("this category is already exists.", 404));
    }
    const category = await Category.create({name,parent})
    res.status(201).json({
        success:true,
        category
    })
})


const getAdsByCategory = asynchandler(async(req,res) => {
    const CatID = req.params.id
    const Ads = await Ad.find({category : CatID})
    .populate('category', 'name') 

    if(!Ads || Ads.length === 0){
        return res.status(404).json({
            message: 'No ads found for this category',
        });
    }

    res.status(201).json({
        message: 'Ad created successfully',
        adsByCat : Ads
    })
})

module.exports = {
    getSubCat,setCategory,getTopCat,getAdsByCategory
}