const express = require("express");
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAdsPerDay , getDashboardStats , getAdsBySubCategory , getAllUsers,deleteUser,updateUserRole,getAllAds,deleteAd } = require('../controllers/admin');
const { getAllReports , createReport , acceptReport , deleteReport} = require('../controllers/report');

router.route('/ads-per-day')
  .get(protect, authorize('admin'), getAdsPerDay); 

router.route('/stats')
  .get(protect, authorize('admin'), getDashboardStats)

router.route('/ads-by-subcategory')
  .get(protect, authorize('admin'), getAdsBySubCategory)

router.route('/users')
  .get(protect , authorize('admin'), getAllUsers)

router.route('/users/:id')
  .delete(protect , authorize('admin'), deleteUser)

router.route('/users/:id/role')
  .put(protect , authorize('admin'), updateUserRole)

router.route('/ads')
  .get(protect , authorize('admin'), getAllAds)

router.route('/ads/:id')
  .delete(protect , authorize('admin'), deleteAd)

router.route('/report')
  .post(protect, createReport); 

router.route('/reports')
  .get(protect, authorize('admin'), getAllReports);

router.route('/:reportId/accept')
  .post(protect, authorize('admin'), acceptReport);

router.route('/:reportId')
  .delete(protect, authorize('admin'), deleteReport);




module.exports = router;
