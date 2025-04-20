const express = require("express")

const router = express.Router()

const { searchAds , filterAds , getPopularAds } = require('../controllers/search')
const { protect ,authorize} = require('../middlewares/authMiddleware')
router.route('/search').get(searchAds)
router.route('/filter').get(filterAds)
router.route('/populare').get(getPopularAds)
module.exports = router