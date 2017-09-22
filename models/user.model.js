const moment = require('moment')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  mobile: String,
  realName: String,
  email: String,
  password: String,
  isShow: { type: Boolean, default: false },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  token: String,
  extra: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
})

userSchema.path('createdAt').get(function (v) {
  return moment(v).format('YYYY-MM-DD hh:mm:ss')
})

userSchema.set('toJSON', { getters: true })

const User = mongoose.model('User', userSchema)

module.exports = User