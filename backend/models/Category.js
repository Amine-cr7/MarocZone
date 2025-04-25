const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  subcategories: [
    {
      name: String,
      brands: [
        {
          name: String,
          models: [String]
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Category", categorySchema);