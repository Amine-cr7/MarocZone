const express = require('express')

const router = express.Router()

const {setCategory, getSubCat, getTopCat, getAdsByCategory } = require('../controllers/category')
const { protect ,authorize} = require('../middlewares/authMiddleware')
router.route('/').get(getTopCat).post(setCategory)
router.route('/:id/ads').get(getAdsByCategory)
router.route('/:parent').get(getSubCat)
module.exports = router