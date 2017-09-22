const moment = require('moment')
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: String,
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
})

categorySchema.path('createdAt').get(function (v) {
    return moment(v).format('YYYY-MM-DD HH:mm:ss')
})

categorySchema.set('toJSON', { getters: true })

const Category = mongoose.model('Category', categorySchema)

module.exports = Category