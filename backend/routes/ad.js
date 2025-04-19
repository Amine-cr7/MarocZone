const express = require("express")

const router = express.Router()

const { createAd,getAllAds,getAdById,updateAd,deleteAd,uploadPhotoAd,getAdsByCategory } = require('../controllers/ad')
const { protect ,authorize} = require('../middlewares/authMiddleware')
router.route('/').get(getAllAds).post(protect,createAd)
router.route('/:id').get(getAdById).put(protect,updateAd).delete(protect,deleteAd)
router.route('/:id/photo').put(protect,uploadPhotoAd)
router.route('/category/:categoryID').get(getAdsByCategory)
module.exports = router