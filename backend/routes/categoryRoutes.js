const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const admin = [protect, authorize("admin")];

const router = express.Router();

router.route("/").get(getCategories).post(...admin, createCategory);
router.route("/:id").get(getCategory).put(...admin, updateCategory).delete(...admin, deleteCategory);

module.exports = router;
