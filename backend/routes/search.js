const express = require("express")

const router = express.Router()

const { searchAds } = require('../controllers/search')
const { protect ,authorize} = require('../middlewares/authMiddleware')
router.route('/').get(searchAds)
module.exports = router