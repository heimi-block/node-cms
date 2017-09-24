const mongoose = require('mongoose')

const attachmentSchema = new mongoose.Schema({
    extname: String,
    url: String,
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
})

const Attachment = mongoose.model('Attachment', attachmentSchema)

module.exports = Attachment