const asynchandler = require('express-async-handler')
const Ad = require('../models/Ad')
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });


const createAd = asynchandler(async (req, res) => {
    const newAd = await Ad.create(req.body)
    res.status(201).json({
        message: 'Ad created successfully',
        ad: newAd
    })
})

const getAllAds = asynchandler(async (req, res) => {
    const AllAds = await Ad.find()
        .populate('category', 'name')
        .populate('user', 'FullName email')
    res.status(200).json({
        message: 'Retrieved all ads',
        ads: AllAds
    })
})

const getAdById = asynchandler(async (req, res) => {
    const id = req.params.id
    const AdById = await Ad.findOne({ _id: id })
        .populate('category', 'name')
        .populate('user', 'FullName email')
    if (!AdById) {
        return res.status(404).json({
            message: 'ad not found',
        })
    }

    res.status(200).json({
        message: 'Retrieved ads',
        ads: AdById
    })
})

const updateAd = asynchandler(async (req, res) => {
    const id = req.params.id

    const updatedAd = await Ad.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedAd) {
        return res.status(404).json({
            message: 'ad not found'
        })
    }
    res.status(202).json({
        message: ' Updated succesfully ',
        UpdateAds: updatedAd
    })
})

const deleteAd = asynchandler(async (req, res) => {
    const id = req.params.id;

    const ad = await Ad.findById(id);

    if (!ad) {
        return res.status(404).json({
            message: 'Ad not found'
        });
    }

    await Ad.findByIdAndDelete(id);

    res.status(202).json({
        message: 'Deleted successfully',
        deletedAd: ad 
    });
});

const uploadPhotoAd = asynchandler(async (req, res) => {
    const ad = await Ad.findById(req.params.id)

    if (!ad) {
        return res.status(404).json({ message: 'Ad not found' })
    }

    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const file = req.files.file

    if (!file.mimetype.startsWith('image')) {
        return res.status(400).json({ message: 'Invalid file type, image only' })
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return res.status(400).json({ message: `File size exceeds limit (${process.env.MAX_FILE_UPLOAD})` })
    }
    

    file.name = `ad_${ad._id}${path.extname(file.name)}`
    const uploadPath = `${process.env.FILE_UPLOAD_PATH}/${file.name}`

    file.mv(uploadPath, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed' })
        }

        await Ad.findByIdAndUpdate(req.params.id, { images: `/uploads/${file.name}` })

        res.status(200).json({
            message: 'Photo uploaded successfully',
            imageUrl: `/uploads/${file.name}`
        })
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
    createAd,
    getAllAds,
    getAdById,
    updateAd,
    deleteAd,
    uploadPhotoAd,
    getAdsByCategory
}