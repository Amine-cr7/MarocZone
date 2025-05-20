const express = require("express");
const router = express.Router();

const {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
  uploadPhotosAd,
  getAdsByUser,
  getComment,
  addComment,
  getRatings,
  addRating
} = require('../controllers/ad');

const {
  getFavorites,
  addFavorite,
  removeFavorite
} = require("../controllers/favorite");

const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getAllAds)
  .post(protect, createAd);

router.route('/user')
  .get(protect, getAdsByUser);

router.route('/favorites')
  .get(protect, getFavorites)
  .post(protect, addFavorite)

router.route('/favorites/:adId')
  .delete(protect, removeFavorite);

router.route('/:id/photo')
  .put(protect, uploadPhotosAd);

router.route('/:id')
  .get(protect, getAdById)
  .put(protect, updateAd)
  .delete(protect, deleteAd);

router.route('/comments/:id')
  .get(getComment)
  .post(protect, addComment);

router.route('/ratings/:id')
  .get(getRatings)
  .post(protect, addRating);

module.exports = router;
