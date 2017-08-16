/**
 *  Post Model
 */

const mongoose = require('mongoose');
const voting = require('mongoose-voting');

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  playlistUri: String,
  spotify: {
    image: String,
    url: String,
    name: String
  },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
 });

postSchema.plugin(voting);

module.exports = mongoose.model('Post', postSchema);
