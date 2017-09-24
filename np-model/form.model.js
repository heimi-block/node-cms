const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
    realName: String,
    email: String,
    mobile: String,
    address: String,
    detail: String,
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
})

const Form = mongoose.model('Form', formSchema)

module.exports = Form