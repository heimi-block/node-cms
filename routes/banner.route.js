const _ = require('lodash')

const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')

const Banner = require('../models/banner.model')
const moment = require('moment')
const mongoose = require('mongoose')

//API:添加banner
const addBanner = (req, res, next) => {

    const formBody = req.body || {}
    const order = Number(formBody.order)
    const imgUrl = formBody.imgUrl
    const title = formBody.title
    const postHref = formBody.postHref
    const isShow = formBody.isShow;

    //需要校验的是order 防止与数据库中的数据重复
    (async () => {
        let check = await storage.find4MStorage('one', { "order": order }, Banner, false, false, false)
        if (!_.isEmpty(check)) {
            res.json({ err: true, message: '该序号不可以重复' })
            return
        }
        const newBanner = new Banner()
        newBanner.order = order
        newBanner.imgUrl = imgUrl
        newBanner.title = title
        newBanner.postHref = postHref
        newBanner.isShow = isShow

        let save = await storage.save4MStorage(newBanner)
        if (save.code === 400) {
            res.json({ err: true, message: '轮播插入失败' })
        } else {
            res.json({ err: false, state: "success", message: '轮播插入成功' })
        }

    })()
}


//API: 删除轮播
const deleteBanner = (req, res, next) => {

    const formBody = req.query || {}

    const id = formBody.id;

    (async () => {

        const banner = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Banner, false, false, false)

        if (_.isEmpty(banner)) {
            res.json({ err: true, message: '该轮播不存在' })
            return
        }

        let del = await storage.removeCondition4MStorage(Banner, { '_id': mongoose.Types.ObjectId(id) })
        if (del.code === 400) {
            res.json({ err: true, message: '轮播删除失败' })
        } else {
            res.json({ err: false, state: "success", message: '轮播删除成功' })
        }

    })()

}

//API: 更新轮播
const editBanner = (req, res, next) => {

    const formBody = req.body || {}

    const id = formBody.id
    const order = Number(formBody.order)
    const imgUrl = formBody.imgUrl
    const title = formBody.title
    const postHref = formBody.postHref
    //   formBody.isShow = formBody.isShow === 'false'
    const isShow = formBody.isShow;

    (async () => {
        //查询该用户是否存在，存在再更新
        const banner = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Banner, false, false, false)
        if (_.isEmpty(banner)) {
            res.json({ err: true, message: '该轮播不存在' })
            return
        }

        let check = await storage.find4MStorage('one', { "order": order }, Banner, false, false, false)
        if (_.isEmpty(check)) {
            res.json({ err: true, message: '该序号不可以重复' })
            return
        }

        banner.order = order
        banner.imgUrl = imgUrl
        banner.title = title
        banner.postHref = postHref
        banner.isShow = isShow

        let save = await storage.update4MStorage(banner)
        if (save.code === 400) {
            res.json({ err: true, message: '轮播更新失败' })
        } else {
            res.json({ err: false, state: "success", message: '轮播更新成功' })
        }

    })()

}

const getBanners = (req, res, next) => {

    (async() => {
        const banners = await storage.find4MStorage('all',{},Banner,false,false,false)
        res.json(banners.map((e, i) => {
          const jsonObject = Object.assign({}, e._doc);
          jsonObject.key = i;
          return jsonObject;
        }));
      })()

}


const getBannersPaging = (req, res, next) => {
    const formBody = req.query || {}
    let page = Number(formBody.page);
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        // const category = await storage.find4MStorage('all',{},Banner,false,false,false)
        //开启分页
        const banner = await storage.find4MStorage('all',{},Banner,skip,pageSize,false)
        const data = banner.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            // jsonObject.key = i;
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Banner,false,false,false)          
        res.json({
            err: false, state: "success",  message: 'Banner信息获取成功', data: data, count: count.length
        }
    )
    })()

}

module.exports = router => {

    router.get('/api/banners', auth('A'), getBanners)
    router.get('/api/banners/paging', auth('A'), getBannersPaging)

    router.post('/api/banner', auth('A'), addBanner)
    router.put('/api/banner', auth('A'), editBanner)
    router.delete('/api/banner', auth('A'), deleteBanner)

}