const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  label: String,
  name: String,
  type: String,
  options: [String],
  required: Boolean
});

const brandSchema = new mongoose.Schema({
  name: String,
  models: [String]
});

const subcategorySchema = new mongoose.Schema({
  name: String,
  brands: [brandSchema],
  fields: [fieldSchema]
});

const categorySchema = new mongoose.Schema({
  name: String,
  subcategories: [subcategorySchema]
});

module.exports = mongoose.model("Category", categorySchema);