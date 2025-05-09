const mongoose = require('mongoose');

const adViewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
  viewedAt: { type: Date, default: Date.now }
});

adViewSchema.index({ userId: 1, adId: 1 }, { unique: true });

module.exports = mongoose.model('AdView', adViewSchema);
