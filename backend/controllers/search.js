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

    const ads = await Ad.find(filter)
    res.status(200).json({
        message : 'success',
        count : ads.length,
        ads
    })
})

const filterAds = asynchandler(async (req, res) => {
    const { minPrice, maxPrice, location, dateFrom, dateTo } = req.query;

    let filter = {};

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (location) {
        filter.location = location;
    }

    if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const ads = await Ad.find(filter).populate('category');

    res.status(200).json({
        message: 'Filtered ads fetched successfully',
        count: ads.length,
        data: ads
    });
});

const getPopularAds = asynchandler(async(req,res) => {
    const ads = await Ad.find().sort({views : -1}).limit(10)

    res.status(200).json({
        message: 'Popular ads fetched successfully',
        count: ads.length,
        ads
    });
})
module.exports = {
    searchAds,
    filterAds,
    getPopularAds
}