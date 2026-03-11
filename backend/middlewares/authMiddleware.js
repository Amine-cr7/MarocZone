const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("No Token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (err) {
    res.status(401);
    throw new Error("Token expired or invalid");
  }

  if (req.user.status !== "active") {
    res.status(403);
    throw new Error("Your account has been banned or suspended");
  }

  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(401);
      throw new Error(
        `User Role ${req.user.role} not Authorized to this route `,
      );
    }
    next();
  };
};
module.exports = { protect, authorize };
