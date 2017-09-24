/*
*
* 轮播控制器
*
*/
const _ = require('lodash')
const mongoose = require('mongoose')
const moment = require('moment')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const Banner = require('np-model/banner.model')
const storage = require('./../np-utils/np-storage')
const bannerCtrl = { list: {}, item: {} }

// 发布轮播
bannerCtrl.list.POST = ({ body: banner, body: { order, imgUrl, title, postHref, isShow } }, res) => {

    if (order == undefined || imgUrl == undefined || title == undefined || postHref == undefined || isShow == undefined) {
        handleError({ res, message: '轮播参数不合法' })
        return false
    };

    (async () => {
        // 验证Order合法性
        let isCorrectly = await storage.find4MStorage('one', { order: order }, Banner, false, false, false)
        if (!_.isEmpty(isCorrectly)) {
            handleError({ res, message: '轮播序号已经存在' })
            return false
        }
        const newBanner = new Banner()
        newBanner.order = order
        newBanner.imgUrl = imgUrl
        newBanner.title = title
        newBanner.postHref = postHref
        newBanner.isShow = isShow

        let result = await storage.save4MStorage(newBanner)
        handleSuccess({ res, result, message: '轮播发布成功' })

    })()
}

// 删除轮播
bannerCtrl.item.DELETE = ({ params: { banner_id } }, res) => {
    (async () => {

        const banner = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(banner_id) }, Banner, false, false, false)

        if (_.isEmpty(banner)) {
            handleError({ res, message: '该轮播不存在' })
            return false
        }

        let result = await storage.removeCondition4MStorage(Banner, { '_id': mongoose.Types.ObjectId(banner_id) })
        handleSuccess({ res, result, message: '轮播删除成功' })

    })()
}

// 修改单个轮播
bannerCtrl.item.PUT = ({ params: { banner_id }, body: banner, body: { name } }, res) => {

  if (order == undefined || imgUrl == undefined || title == undefined || postHref == undefined || isShow == undefined) {
      handleError({ res, message: '轮播参数不合法' })
      return false
  };

    (async () => {
        //验证该轮播是否存在
        const banner = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(banner_id) }, Banner, false, false, false)
        if (_.isEmpty(banner)) {
            handleError({ res, message: '该轮播不存在' })
            return false
        }
        // 验证Order合法性
        let isCorrectly = await storage.find4MStorage('one', { order: order }, Banner, false, false, false)
        if (!_.isEmpty(isCorrectly)) {
            handleError({ res, message: '轮播序号已经存在，不可重复' })
            return false
        }
        // 修改
        banner.order = order
        banner.imgUrl = imgUrl
        banner.title = title
        banner.postHref = postHref
        banner.isShow = isShow

        let result = await storage.update4MStorage(banner)
        handleSuccess({ res, result, message: '轮播修改成功' })
    })()

}

// 分页获取所有轮播
bannerCtrl.list.GET = (req, res) => {

    const formBody = req.query || {}
    // 过滤条件
    let page = Number(formBody.page)
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        //开启分页
        const banner = await storage.find4MStorage('all',{},Banner,skip,pageSize,false)
        const result = banner.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Banner,false,false,false)
       handleSuccess({ res, message: '轮播列表分页获取成功', result:{
        count: count.length,
        data:result
       }})
    })()

}

exports.list = (req, res) => { handleRequest({ req, res, controller: bannerCtrl.list }) }
exports.item = (req, res) => { handleRequest({ req, res, controller: bannerCtrl.item }) }
