const express = require('express')

const router = express.Router()

const {setCategory,getAdsByCategory, getCategories } = require('../controllers/category')
const { protect ,authorize} = require('../middlewares/authMiddleware')
router.route('/').get(getCategories).post(setCategory)
router.route('/:id/ads').get(getAdsByCategory)
module.exports = router