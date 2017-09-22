const moment = require('moment')
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

metaSchema.path('createdAt').get(function (v) {
    return moment(v).format('YYYY-MM-DD hh:mm:ss')
  })
  
metaSchema.set('toJSON', { getters: true })

const Meta = mongoose.model('Meta', metaSchema)

module.exports = Meta