const asyncHandler = require('express-async-handler');
const Favorite = require('../models/Favorite');
const Ad = require('../models/Ad');
const ErrorResponse = require('../utils/ErrorResponse');

const getFavorites = asyncHandler(async (req, res, next) => {
    const favorites = await Favorite.find({ user: req.user._id }).populate('ad');
    res.status(200).json(favorites);
});

const addFavorite = asyncHandler(async (req, res, next) => {
    const { adId } = req.body;

    const alreadyExists = await Favorite.findOne({ user: req.user._id, ad: adId });
    if (alreadyExists) {
        return next(new ErrorResponse('Ad already in favorites', 400));
    }

    const newFav = new Favorite({ user: req.user._id, ad: adId });
    await newFav.save();

    res.status(201).json({ message: 'Ad added to favorites' });
});

const removeFavorite = asyncHandler(async (req, res, next) => {
    const { adId } = req.body;

    const deleted = await Favorite.findOneAndDelete({ user: req.user._id, ad: adId });
    if (!deleted) {
        return next(new ErrorResponse('Favorite not found', 404));
    }

    res.status(200).json({ message: 'Ad removed from favorites' });
});

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite
};
