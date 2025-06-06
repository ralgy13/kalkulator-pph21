const mongoose = require('mongoose');

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: { type: String, enum: ['none', '30days', '365days'], default: 'none' },
    createdAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    trialExpiry: { type: Date, default: null }
  });

  module.exports = mongoose.model('User', userSchema);