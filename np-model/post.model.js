const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  title: String,
  coverUrl: String,
  postHref: String,
  content: String,
  isShow: { type: Boolean, default: false },
  extra: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
