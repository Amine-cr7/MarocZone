const express = require("express")

const router = express.Router()

const { createAd,getAllAds,getAdById,updateAd,deleteAd,uploadPhotosAd, getAdsByUser } = require('../controllers/ad')
const { protect ,authorize} = require('../middlewares/authMiddleware')
router.route('/').get(getAllAds).post(protect,createAd)
router.route('/user').get(protect,getAdsByUser)
router.route('/:id').get(protect,getAdById).put(protect,updateAd).delete(protect,deleteAd)
router.route('/:id/photo').put(protect,uploadPhotosAd)
module.exports = router