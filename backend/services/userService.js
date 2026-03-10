const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

const register = async (data) => {
  const { fullName, email, password, phone, location } = data;

  const existing = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existing) {
    if (existing.email === email)
      throw new ErrorResponse(
        "This email is already associated with an account",
        409,
      );
    if (existing.phone === phone)
      throw new ErrorResponse(
        "This phone is already associated with an account",
        409,
      );
  }
  const user = await User.create({
    fullName,
    email,
    password: await hashPassword(password),
    phone,
    location,
  });

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    location: user.location,
    token: generateToken(user._id),
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ErrorResponse("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ErrorResponse("Invalid email or password", 401);

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    location: user.location,
    role: user.role,
    token: generateToken(user._id),
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ErrorResponse("No account found with this email", 404);

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <p>Hi ${user.fullName},</p>
      <p>You requested a password reset.</p>
      <p>Your reset token: <strong>${resetToken}</strong></p>
      <p>This token expires in 10 minutes.</p>
    `,
  });

  return resetToken;
};

const resetPassword = async ({ resetToken, newPassword }) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new ErrorResponse("Invalid or expired token", 400);

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

// ─── User ─────────────────────────────────────────────────────────────────────

const getMe = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new ErrorResponse("User not found", 404);
  return user;
};

const updateMe = async (userId, data) => {
  // prevent password update through this route
  delete data.password;
  delete data.role;

  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) throw new ErrorResponse("User not found", 404);
  return user;
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new ErrorResponse("User not found", 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ErrorResponse("Current password is incorrect", 401);

  user.password = await hashPassword(newPassword);
  await user.save();
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  updatePassword,
};
