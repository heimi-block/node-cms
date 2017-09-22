const moment = require('moment')
const mongoose = require('mongoose')

const infoScheam = new mongoose.Schema({
    googleMap: String, //谷歌地图经纬度','
    contactTel: String, //客服专线
    faxNumber: String, //传真资讯
    contactEmail: String, //客服信箱
    contactAddress: String, //联络地址
    workTime: String, //营业时间
    copyright: String, //版权信息
    aboutUs: String, //关于我们
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
})

infoScheam.path('createdAt').get(function (v) {
    return moment(v).format('YYYY-MM-DD hh:mm:ss')
})

infoScheam.set('toJSON', { getters: true })

const Info = mongoose.model('Info', infoScheam)

module.exports = Info