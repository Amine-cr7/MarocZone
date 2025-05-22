const express = require("express");
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAdsPerDay } = require('../controllers/admin');

router.route('/ads-per-day')
  .get(protect, authorize('admin'), getAdsPerDay); 

module.exports = router;
