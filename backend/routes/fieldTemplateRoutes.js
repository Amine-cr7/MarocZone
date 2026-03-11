const express = require("express");
const {
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
} = require("../controllers/fieldTemplateController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const admin = [protect, authorize("admin")];

const router = express.Router();

router.route("/").get(getFields).post(...admin, createField);
router.route("/:id").get(getField).put(...admin, updateField).delete(...admin, deleteField);

module.exports = router;
