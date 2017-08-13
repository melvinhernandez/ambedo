/**
 *  User Model
 */

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  role: { type: String, default: 'user' },
  spotify: {
    id: String,
    username: String,
    name: String,
    url: String,
    token: String,
    refreshToken: String,
    expires: Date
  }
 });

module.exports = mongoose.model('User', userSchema);
