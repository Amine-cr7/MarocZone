const express = require('express')

const router = express.Router()

const {getCategories,setCategory} = require('../controllers/category')
const { protect ,authorize} = require('../middlewares/authMiddleware')
router.route('/').get(protect,getCategories).post(protect,setCategory)
module.exports = router