const express = require("express");
const {
  register,
  login,
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
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

// ─── User routes (/api/users) ─────────────────────────────────────────────────
const userRouter = express.Router();

userRouter.get("/me", protect, getMe);
userRouter.put("/me", protect, updateMe);
userRouter.put("/me/password", protect, updatePassword);

module.exports = { authRouter, userRouter };