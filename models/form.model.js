const moment = require('moment')
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

formSchema.path('createdAt').get(function (v) {
    return moment(v).format('YYYY-MM-DD hh:mm:ss')
})

formSchema.set('toJSON', { getters: true })

const Form = mongoose.model('Form', formSchema)

module.exports = Form