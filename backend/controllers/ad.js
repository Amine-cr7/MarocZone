const Ad = require("../models/Ad");
const asynchandler = require("express-async-handler");
const path = require("path");
const dotenv = require("dotenv");
const ErrorResponse = require("../utils/ErrorResponse");
const Adview = require("../models/Adview");
const mongoose = require("mongoose");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const createAd = asynchandler(async (req, res, next) => {
  const { title, description, price, phone, brand, model, subCat, location } =
    req.body;
  if (!title || !description || !price || !phone || !subCat || !location) {
    return next(
      new ErrorResponse(
        "All fields (title, description, price, subCat, location) are required.",
        400
      )
    );
  }

  const newAd = await Ad.create({
    ...req.body,
    user: req.user.id,
  });
  res.status(201).json({
    message: "Ad created successfully",
    ad: newAd,
  });
});

const getAllAds = asynchandler(async (req, res, next) => {
  const allAds = await Ad.find({ status: "published" });
  if (!allAds || allAds.length === 0) {
    return res.status(404).json({
      message: "No ads found",
      ads: [],
    });
  }
  res.status(200).json(allAds);
});

const getAdById = asynchandler(async (req, res) => {
  const id = req.params.id;
  const userId = req.user?.id;

  const AdById = await Ad.findOne({ _id: id }).populate(
    "user",
    "FullName email"
  );

  if (!AdById) {
    return res.status(404).json({
      message: "Ad not found",
    });
  }

  if (userId) {
    const existingView = await Adview.findOne({ adId: id, userId: userId });

    if (!existingView) {
      const newView = new Adview({
        adId: id,
        userId: userId,
      });
      await newView.save();

      AdById.views = (AdById.views || 0) + 1;
      await AdById.save();
    }
  }

  res.status(200).json(AdById);
});

const updateAd = asynchandler(async (req, res) => {
  const id = req.params.id;
  const updatedAd = await Ad.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedAd) {
    return res.status(404).json({
      message: "ad not found",
    });
  }
  res.status(202).json({
    message: " Updated succesfully ",
    UpdateAds: updatedAd,
  });
});
const deleteAd = asynchandler(async (req, res) => {
  const id = req.params.id;
  const ad = await Ad.findById(id);
  if (!ad) {
    return res.status(404).json({
      message: "Ad not found",
    });
  }
  await Ad.findByIdAndDelete(id);
  res.status(202).json({
    message: "Deleted successfully",
    deletedAd: ad,
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
    if (!file.mimetype.startsWith("image")) {
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
  ad.status = "published";
  await ad.save();
  console.log(ad);
  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: uploadedFileNames,
  });
});

const getAdsByUser = asynchandler(async (req, res) => {
  const ads = await Ad.find({
    user: req.user.id,
    status: "published",
  }).populate("user", "FullName");

  if (!ads || ads.length === 0) {
    return res.status(404).json({
      message: "No ads found for this User",
    });
  }

  res.status(201).json(ads);
});

const addComment = asynchandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(404).json({
      message: "comment cannot be empty",
    });
  }

  const comment = {
    user: req.user.id,
    text: text.trim(),
    createdAt: Date.now(),
  };

  const ad = await Ad.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: comment } },
    { new: true, runValidators: true }
  ).populate("comments.user", "FullName");

  if (!ad) {
    return res.status(400).json({
      message: "Ad not found",
    });
  }

  res.status(201).json({
     ad
  });
});

const getComment = asynchandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id)
    .select("comments")
    .populate("comments.user", "FullName");

  if (!ad) {
    return res.status(404).json({
      message: "Ad not found",
    });
  }

  res.status(200).json(ad.comments);
});

const addRating = asynchandler(async (req, res) => {
  const { stars } = req.body;

  if (!stars || stars < 1 || stars > 5) {
    return res.status(404).json({
      message: "Please provide a rating between 1 and 5",
    });
  }

  // Try to update existing rating
  let ad = await Ad.findOneAndUpdate(
    { _id: req.params.id, "ratings.user": req.user.id },
    { $set: { "ratings.$.stars": stars } },
    { new: true }
  );

  // If no previous rating, add a new one
  if (!ad) {
    const rating = {
      user: req.user.id,
      stars,
    };

    ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $push: { ratings: rating } },
      { new: true, runValidators: true }
    );
  }

  // Fix: Use new mongoose.Types.ObjectId()
  const result = await Ad.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    { $unwind: "$ratings" },
    {
      $group: {
        _id: "$_id",
        averageRating: { $avg: "$ratings.stars" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    ad = await Ad.findByIdAndUpdate(
      req.params.id,
      {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        ratingCount: result[0].ratingCount,
      },
      { new: true }
    );
  }

  res.status(200).json(stars);
});

const getRatings = asynchandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id)
    .select("ratings averageRating ratingCount")
    .populate("ratings.user", "FullName");

  if (!ad) {
    return res.status(404).json({
      message: "Ad not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      ratings: ad.ratings,
      averageRating: ad.averageRating,
      ratingCount: ad.ratingCount,
    },
  });
});

module.exports = {
  createAd,
  getAllAds,
  getAdById,
  getAdsByUser,
  updateAd,
  deleteAd,
  uploadPhotosAd,
  addComment,
  getComment,
  addRating,
  getRatings,
};
