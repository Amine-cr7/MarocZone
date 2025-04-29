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
    getCategories,setCategory,getAdsByCategory
}