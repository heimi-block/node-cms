const moment = require('moment')
const mongoose = require('mongoose')

const attachmentSchema = new mongoose.Schema({
    extname: String,
    url: String,
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
})

attachmentSchema.path('createdAt').get(function (v) {
    return moment(v).format('YYYY-MM-DD hh:mm:ss')
  })
  
attachmentSchema.set('toJSON', { getters: true })

const Attachment = mongoose.model('Attachment', attachmentSchema)

module.exports = Attachment