const express = require("express");
const {
  getAllAds,
  getAdById,
  getAdsByUser,
  createAd,
  updateAd,
  deleteAd,
  uploadPhotosAd,
  changeAdStatus,
} = require("../controllers/adcontroller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(getAllAds).post(protect, createAd);

router.route("/user").get(protect, getAdsByUser);

router.route("/:id/status").put(protect, changeAdStatus);

router
  .route("/:id")
  .get(getAdById)
  .put(protect, updateAd)
  .delete(protect, deleteAd);

router.route("/:id/photos").put(protect, uploadPhotosAd);

module.exports = router;
