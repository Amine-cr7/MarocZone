const express = require("express")

const router = express.Router()

const { createAd,getAllAds,getAdById,updateAd,deleteAd,uploadPhotosAd,getAdsByUser } = require('../controllers/ad')
const { protect ,authorize} = require('../middlewares/authMiddleware')
router.route('/').get(getAllAds).post(protect,createAd)
router.route('/:id').get(getAdById).put(protect,updateAd).delete(protect,deleteAd)
router.route('/user').get(getAdsByUser)
router.route('/:id/photo').put(protect,uploadPhotosAd)
module.exports = router