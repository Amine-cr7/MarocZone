const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    images: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: String,
    details: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
});  

module.exports = mongoose.model('Ad',adSchema)