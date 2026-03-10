const express = require("express");
const {
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
} = require("../controllers/fieldTemplateController");

const router = express.Router();

router.route("/").get(getFields).post(createField);

router.route("/:id").get(getField).put(updateField).delete(deleteField);

module.exports = router;