const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: String,
  started: { type: Boolean, default: false },
  startedAt: { type: Date, default: null },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
