/**
 *  Post Model
 */

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  playlistUrl: String,
  user_id: mongoose.Schema.ObjectId,
  user: { type: mongoose.Schema.ObjectId, ref: 'user' }
 });

module.exports = mongoose.model('Post', postSchema);
