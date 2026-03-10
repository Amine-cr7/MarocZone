const asyncHandler = require("express-async-handler");
const userService = require("../services/userService");

// ─── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const user = await userService.register(req.body);
  res.status(201).json(user);
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const user = await userService.login(req.body);
  res.status(200).json(user);
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  await userService.forgotPassword(req.body.email);
  res.status(200).json({ message: "Reset token sent to email" });
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  await userService.resetPassword(req.body);
  res.status(200).json({ message: "Password reset successfully" });
});

// ─── User ─────────────────────────────────────────────────────────────────────

// GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.status(200).json(user);
});

// PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user.id, req.body);
  res.status(200).json({ message: "Profile updated", data: user });
});

// PUT /api/users/me/password
const updatePassword = asyncHandler(async (req, res) => {
  await userService.updatePassword(req.user.id, req.body);
  res.status(200).json({ message: "Password updated successfully" });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  updatePassword,
};