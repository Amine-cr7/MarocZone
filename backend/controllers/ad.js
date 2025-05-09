const Ad = require('../models/Ad')
const asynchandler = require('express-async-handler')
const path = require('path')
const dotenv = require('dotenv');
const ErrorResponse = require('../utils/ErrorResponse');
dotenv.config({ path: path.resolve(__dirname, '../.env') });


const createAd = asynchandler(async (req, res, next) => {
    const { title, description, price, phone, brand, model, subCat, location } = req.body;
    if (!title || !description || !price || !phone || !subCat || !location) {
        return next(
            new ErrorResponse("All fields (title, description, price, subCat, location) are required.", 400)
        );
    }

    const newAd = await Ad.create({
        ...req.body,
        user: req.user.id
    });
    res.status(201).json({
        message: 'Ad created successfully',
        ad: newAd
    })
})

const getAllAds = asynchandler(async (req, res, next) => {
    const allAds = await Ad.find({status:"published"})
    if (!allAds || allAds.length === 0) {
        return res.status(404).json({
            message: 'No ads found',
            ads: []
        });
    }
    res.status(200).json(allAds);
});


const getAdById = asynchandler(async (req, res) => {
    const id = req.params.id
    const AdById = await Ad.findOne({ _id: id })
        .populate('user', 'FullName email')
    if (!AdById) {
        return res.status(404).json({
            message: 'ad not found',
        })
    }

    AdById.views = (AdById.views || 0) + 1;
    await AdById.save();


    res.status(200).json(AdById)
})


// const getAdById = asynchandler(async (req, res) => {
//     const id = req.params.id;
//     const userId = req.user.id;

//     const AdById = await Ad.findOne({ _id: id }).populate('user', 'FullName email');
//     if (!AdById) {
//         return res.status(404).json({
//             message: 'Ad not found',
//         });
//     }

//     const existingView = await AdView.findOne({ adId: id, userId: userId });

//     if (!existingView) {
     
//         const newView = new AdView({
//             adId: id,
//             userId: userId,
//         });

//         await newView.save();
      
//         AdById.views = (AdById.views || 0) + 1;
//         await AdById.save();
//     }

//     res.status(200).json(AdById);
// });
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

const uploadPhotosAd = asynchandler(async (req, res, next) => {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
        return next(new ErrorResponse("Ad not found", 404));
    }

    if (ad.user != req.user.id) {
        return next(new ErrorResponse("This is not your ad", 403));
    }

    if (!req.files || !req.files.files) {
        return next(new ErrorResponse("No files uploaded", 400));
    }

    let files = req.files.files;

    // Make sure files is always an array
    if (!Array.isArray(files)) {
        files = [files];
    }

    const uploadedFileNames = [];

    for (const file of files) {
        if (!file.mimetype.startsWith('image')) {
            return next(new ErrorResponse("One of the files is not an image", 400));
        }

        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return next(new ErrorResponse(`File size too large: ${file.name}`, 400));
        }

        // Rename file
        const fileName = `photo_${ad._id}_${Date.now()}_${file.name}`;
        const uploadPath = `${process.env.FILE_UPLOAD_PATH}/${fileName}`;

        await file.mv(uploadPath, (err) => {
            if (err) {
                console.error("UPLOAD ERROR:", err);
                return next(new ErrorResponse("File upload failed", 500));
            }
        });

        uploadedFileNames.push(fileName);
    }

    // Example: Save array of file names to ad model
    ad.images = uploadedFileNames; // Make sure your model supports this
    ad.status = 'published'; 
    await ad.save();
    console.log(ad)
    res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: uploadedFileNames
    });
});
const getAdsByUser = asynchandler(async(req,res) => {
    const ads = await Ad.find({user : req.user.id,status:"published"})
    .populate('user', 'FullName') 

    if(!ads || ads.length === 0){
        return res.status(404).json({
            message: 'No ads found for this User',
        });
    }

    res.status(201).json(ads)
})



module.exports = {
    createAd,
    getAllAds,
    getAdById,
    getAdsByUser,
    updateAd,
    deleteAd,
    uploadPhotosAd,
}