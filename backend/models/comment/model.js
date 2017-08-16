/**
 *  Comment Model
 */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const commentSchema = mongoose.Schema({
  text: { type: String, required: true },
  trackUri: String,
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.ObjectId, ref: 'Post'}
 });

module.exports = mongoose.model('Post', postSchema);
