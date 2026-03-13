const asyncHandler = require("express-async-handler");
const userService = require("../services/userService");

// ─── Cookie config ────────────────────────────────────────────────────────────

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const device = req.headers["user-agent"];
  const { user, accessToken, refreshToken } = await userService.register(req.body, device);

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
  res.status(201).json({ user, accessToken });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const device = req.headers["user-agent"];
  const { user, accessToken, refreshToken } = await userService.login(req.body, device);

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ user, accessToken });
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await userService.refresh(refreshToken);
  res.status(200).json({ accessToken });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  await userService.logout(refreshToken);
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

// POST /api/auth/logout-all
const logoutAll = asyncHandler(async (req, res) => {
  await userService.logoutAll(req.user.id);
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out from all devices" });
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
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  updatePassword,
};