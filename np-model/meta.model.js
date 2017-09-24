const mongoose = require('mongoose')

const metaSchema = new mongoose.Schema({
    description: String,
    keywords: String,
    themeCss: String, 
    headerScript: String,
    footerScript: String,
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
})

const Meta = mongoose.model('Meta', metaSchema)

module.exports = Meta