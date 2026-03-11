const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    phone: { type: String },
    images: [String],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: String,
    status: {
      type: String,
      enum: ["pending", "published","rejected", "sold", "expired"],
      default: "draft",
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
); 
module.exports = mongoose.model("Ad", adSchema);