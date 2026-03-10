const express = require("express");
const {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategoryController");

const router = express.Router();

router.route("/").get(getSubcategories).post(createSubcategory);

router
  .route("/:id")
  .get(getSubcategory)
  .put(updateSubcategory)
  .delete(deleteSubcategory);

module.exports = router;