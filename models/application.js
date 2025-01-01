const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  start: { type: Date, default: null },
  duration: { type: Number, default: null }
});

module.exports = mongoose.model('Application', applicationSchema);
