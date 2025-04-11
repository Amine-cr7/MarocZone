const express = require('express')

const router = express.Router()

const {registerUser, loginUser, UpdateUserDetails, ForgotPassword, ResetPassword} = require('../controllers/auth')
const { protect } = require('../middlewares/authMiddleware')

router.route('/').post(registerUser).put(protect,UpdateUserDetails)
router.post('/login',loginUser)
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password",ResetPassword);
module.exports = router