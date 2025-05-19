const asyncHandler = require('express-async-handler');
const Favorite = require('../models/Favorite');
const Ad = require('../models/Ad')
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse');

const getFavorites = asyncHandler(async (req, res, next) => {
      const favorites = await Favorite.find({ user: req.user.id }).populate('ad');
    res.status(200).json(favorites);
});

const addFavorite = asyncHandler(async (req, res, next) => {
    const { adId } = req.body;

    const alreadyExists = await Favorite.findOne({ user: req.user.id, ad: adId });
    if (alreadyExists) {
        return next(new ErrorResponse('Ad already in favorites', 400));
    }

    const newFav = new Favorite({ user: req.user.id, ad: adId });
    await newFav.save();

    res.status(201).json({ message: 'Ad added to favorites' });
});

const removeFavorite = asyncHandler(async (req, res, next) => {
    try {
        const { adId } = req.params;
        
        // Validate the adId is a proper MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(adId)) {
            return next(new ErrorResponse('Invalid Ad ID', 400));
        }

        // Verify the ad exists first
        const adExists = await Ad.findById(adId);
        if (!adExists) {
            return next(new ErrorResponse('Ad not found', 404));
        }

        const deleted = await Favorite.findOneAndDelete({ 
            user: req.user._id,
            ad: adId 
        });

        if (!deleted) {
            return next(new ErrorResponse('Favorite not found', 404));
        }

        res.status(200).json({ 
            success: true,
            message: 'Ad removed from favorites',
            adId 
        });
    } catch (error) {
        console.error('Error in removeFavorite:', error);
        next(new ErrorResponse(error.message, 500)); // Send actual error message
    }
});

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite
};
