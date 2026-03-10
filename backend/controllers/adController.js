const asyncHandler = require("express-async-handler");
const adService = require("../services/adService");

// GET /api/ads
// GET /api/ads?category=id&subcategory=id&location=casablanca&minPrice=100&maxPrice=5000
const getAllAds = asyncHandler(async (req, res) => {
  const ads = await adService.getAllAds(req.query);
  res.status(200).json(ads);
});

// GET /api/ads/:id
const getAdById = asyncHandler(async (req, res) => {
  const ad = await adService.getAdById(req.params.id);
  res.status(200).json(ad);
});

// GET /api/ads/user  (uses req.user.id from protect middleware)
const getAdsByUser = asyncHandler(async (req, res) => {
  const ads = await adService.getAdsByUser(req.user.id);
  res.status(200).json(ads);
});

// POST /api/ads
const createAd = asyncHandler(async (req, res) => {
  const ad = await adService.createAd(req.body, req.user.id);
  res.status(201).json({ message: "Ad created", data: ad });
});

// PUT /api/ads/:id
const updateAd = asyncHandler(async (req, res) => {
  const ad = await adService.updateAd(req.params.id, req.body, req.user.id);
  res.status(200).json({ message: "Ad updated", data: ad });
});

// DELETE /api/ads/:id
const deleteAd = asyncHandler(async (req, res) => {
  await adService.deleteAd(req.params.id, req.user.id);
  res.status(200).json({ message: "Ad deleted" });
});

// PUT /api/ads/:id/photos
const uploadPhotosAd = asyncHandler(async (req, res) => {
  const fileNames = await adService.uploadAdPhotos(
    req.params.id,
    req.user.id,
    req.files,
    {
      MAX_FILE_UPLOAD: process.env.MAX_FILE_UPLOAD,
      FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
    }
  );
  res.status(200).json({ message: "Images uploaded successfully", data: fileNames });
});

module.exports = {
  getAllAds,
  getAdById,
  getAdsByUser,
  createAd,
  updateAd,
  deleteAd,
  uploadPhotosAd,
};