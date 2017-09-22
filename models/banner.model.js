const moment = require('moment')
const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    order: Number,
    imgUrl: String, 
    title: String,
    postHref: String,
    isShow: { type: Boolean, default: false },
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
})

bannerSchema.path('createdAt').get(function (v) {
    return moment(v).format('YYYY-MM-DD hh:mm:ss')
  })
  
bannerSchema.set('toJSON', { getters: true })

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner