const asynchandler = require('express-async-handler')
const Ad = require('../models/Ad') 

const searchAds = asynchandler( async(req,res) => {
    const { keyword , category , minPrice , maxPrice} = req.query

    let filter = {}

    if(keyword){
        filter.title = { $regex : keyword, $options : 'i'}
    }
    
    if(category){
        filter.category = category
    }
    if(minPrice || maxPrice){
        filter.price = {}
        if(minPrice) filter.price.$gte = Number(minPrice)
        if(maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const ads = await Ad.find(filter).find({status : 'published'})
    res.status(200).json(ads)
})

const filterAds = asynchandler(async (req, res) => {
    const { minPrice, maxPrice, location, dateFrom, dateTo, subCat, brand, model } = req.query;
    console.log(req.query)
    let filter = {};

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (location) {
        filter.location = location;
    }

    if (subCat) {
        filter.subCat = subCat;
    }

    if (brand) {
        filter.brand = brand;
    }

    if (model) {
        filter.model = model;
    }

    if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const ads = await Ad.find(filter).find({status : 'published'});

    res.status(200).json( ads);
});


const getPopularAds = asynchandler(async(req,res) => {
    const ads = await Ad.find().sort({views : -1}).limit(10)

    res.status(200).json(ads);
})
module.exports = {
    searchAds,
    filterAds,
    getPopularAds
}