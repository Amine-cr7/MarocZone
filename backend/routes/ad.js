const express = require("express");
const router = express.Router();

const {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
  uploadPhotosAd,
  getAdsByUser
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
  .delete(protect, removeFavorite);

router.route('/:id/photo')
  .put(protect, uploadPhotosAd);

router.route('/:id')
  .get(protect, getAdById)
  .put(protect, updateAd)
  .delete(protect, deleteAd);

module.exports = router;
