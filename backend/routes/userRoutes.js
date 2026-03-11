const express = require("express");
const {
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
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// ─── Auth routes (/api/auth) ──────────────────────────────────────────────────
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.post("/logout-all", protect, logoutAll);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

// ─── User routes (/api/users) ─────────────────────────────────────────────────
const userRouter = express.Router();

userRouter.get("/me", protect, getMe);
userRouter.put("/me", protect, updateMe);
userRouter.put("/me/password", protect, updatePassword);

module.exports = { authRouter, userRouter };