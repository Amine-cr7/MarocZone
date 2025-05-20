const asynchandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const crypto = require("crypto")
const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();

const registerUser = asynchandler(async (req, res, next) => {
  const { FullName, email, password, phone } = req.body;
  if (!FullName || !email || !password || !phone) {
    return next(new ErrorResponse("All fields (FullName,city,adresse,phone, email, password) are required.", 400));
  }
  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    return next(new ErrorResponse("This email is already associated with an account.", 400));
  }
  const checkphone = await User.findOne({ phone });
  if (checkphone) {
    return next(new ErrorResponse("This phone is already associated with an account.", 400));
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    FullName,
    email,
    password: hashedPassword,
    phone,
    // location,
  });

  res.status(201).json({
    success: true,
      id: user._id,
      FullName: user.FullName,
      email: user.email,
      role: user.role, 
      jwtToken: generateToken(user._id)
  });
});
const loginUser = asynchandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new ErrorResponse("All fields (email, password) are required.", 400))
  };
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("User not found with this email address.", 404));
  }

  const passMatch = await bcrypt.compare(password, user.password);
  if (!passMatch) {
    return next(new ErrorResponse("Incorrect password. Please try again.", 400));
  }
  res.status(200).json({
    id: user._id,
    FullName: user.FullName,
    email: user.email,
    role: user.role, 
    jwtToken: generateToken(user._id)
  });
})

const UpdateUserDetails = asynchandler(async (req, res, next) => {
  const { FullName, email, location, phone } = req.body;


  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const updateDetails = {
    FullName, email, location, phone, password
  };

  const user = await User.findByIdAndUpdate(req.user.id, updateDetails, { new: true, runValidators: true });

  if (!user) {
    return next(new ErrorResponse("User not found or failed to update.", 404));
  }

  res.status(200).json({
    message: "User details updated successfully.",
    user
  });
});


// forget
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

const ForgotPassword = asynchandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("Email Not Found.", 404));
  }

  //Get reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    text: `Hi ${user.FullName} You requested a password reset. Click the link to reset your password: `,
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   `
  };

  await transporter.sendMail(mailOptions)
  res.status(200).json({
    success: true,
    message: "Token Send",
    resetToken: resetToken
  });
})

const ResetPassword = asynchandler(async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword, salt)
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successfully" });

})

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
module.exports = {
  registerUser,
  loginUser,
  UpdateUserDetails,
  ForgotPassword,
  ResetPassword
};