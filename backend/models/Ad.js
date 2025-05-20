const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  phone: Number,
  images: [String],
  subCat: String,
  brand: String,
  model: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: String,
  details: mongoose.Schema.Types.Mixed,
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  views: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  ratingCount: {
    type: Number,
    default: 0,
  },
  
  createdAt: { type: Date, default: Date.now },
});

adSchema.index({ '_id': 1, 'ratings.user': 1 }, { unique: true });

module.exports = mongoose.model("Ad", adSchema);


