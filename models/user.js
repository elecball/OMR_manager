const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  discriminator: String,
});

module.exports = mongoose.model('User', userSchema);
