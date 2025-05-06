const express = require('express')

const router = express.Router()

const {setCategory, getCategories } = require('../controllers/category')
router.route('/').get(getCategories).post(setCategory)
module.exports = router