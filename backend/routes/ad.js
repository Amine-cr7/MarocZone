const express = require("express")

const router = express.Router()

const { createAd,getAllAds,getAdById,updateAd,deleteAd,uploadPhotosAd, getAdsByUser } = require('../controllers/ad')
const { protect ,authorize} = require('../middlewares/authMiddleware')
const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favorite")
router.route('/').get(getAllAds).post(protect,createAd)
router.route('/user').get(protect,getAdsByUser)
router.route('/:id').get(protect,getAdById).put(protect,updateAd).delete(protect,deleteAd)
router.route('/:id/photo').put(protect,uploadPhotosAd)
router.route('/').get(protect,getFavorites)
router.post('/', addFavorite);
router.delete('/', removeFavorite);
module.exports = router