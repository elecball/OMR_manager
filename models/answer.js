const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: String,
  answer: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);
