const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: String,
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category