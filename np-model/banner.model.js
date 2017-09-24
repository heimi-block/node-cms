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

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner