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
    views: {
        type:Number,
        default:0
    },
    createdAt: { type: Date, default: Date.now }
});  

module.exports = mongoose.model('Ad',adSchema)