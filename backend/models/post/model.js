/**
 *  Post Model
 */

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  playlistUri: String,
  spotify: {
    image: String,
    url: String,
    name: String
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
 });

module.exports = mongoose.model('Post', postSchema);
