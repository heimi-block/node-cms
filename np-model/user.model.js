const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isShow: { type: Boolean, default: false },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  extra: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

module.exports = User