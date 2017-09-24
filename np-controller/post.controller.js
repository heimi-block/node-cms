/*
*
* 文章控制器
*
*/
const _ = require('lodash')
const mongoose = require('mongoose')
const moment = require('moment')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const Post = require('np-model/post.model')
const storage = require('./../np-utils/np-storage')
const postCtrl = { list: {}, item: {} }

// 发布文章
postCtrl.list.POST = ({ body: post, body: { category, title, coverUrl, content, isShow } }, res) => {

    if (category == undefined || title == undefined || coverUrl == undefined || content == undefined || isShow == undefined) {
        handleError({ res, message: '文章参数不合法' })
        return false
    };

    (async () => {
        // 验证Title合法性
        let isCorrectly = await storage.find4MStorage('one', { title: title }, Post, false, false, false)
        if (!_.isEmpty(isCorrectly)) {
            handleError({ res, message: '文章名称已经存在' })
            return false
        }
        const newPost = new Post()
        newPost.category = category
        newPost.title = title
        newPost.coverUrl = coverUrl
        newPost.content = content
        newPost.isShow = isShow

        let result = await storage.save4MStorage(newPost)
        handleSuccess({ res, result, message: '文章发布成功' })

    })()
}

// 删除文章
postCtrl.item.DELETE = ({ params: { post_id } }, res) => {
    (async () => {

        const post = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(post_id) }, Post, false, false, false)

        if (_.isEmpty(post)) {
            handleError({ res, message: '该文章不存在' })
            return false
        }

        let result = await storage.removeCondition4MStorage(Post, { '_id': mongoose.Types.ObjectId(post_id) })
        handleSuccess({ res, result, message: '文章删除成功' })

    })()
}

// 修改单个文章
postCtrl.item.PUT = ({ params: { post_id }, body: post, body: { name } }, res) => {

      if (category == undefined || title == undefined || coverUrl == undefined || content == undefined || isShow == undefined) {
          handleError({ res, message: '文章参数不合法' })
          return false
      };

    (async () => {
        //验证该文章是否存在
        const post = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(post_id) }, Post, false, false, false)
        if (_.isEmpty(post)) {
            handleError({ res, message: '该文章不存在' })
            return false
        }
        // 修改
        post.category = category
        post.title = title
        post.coverUrl = coverUrl
        post.content = content
        post.isShow = isShow

        let result = await storage.update4MStorage(post)
        handleSuccess({ res, result, message: '文章修改成功' })
    })()

}

// 分页获取所有文章
postCtrl.list.GET = (req, res) => {
    const formBody = req.query || {}
    // 过滤条件
    let page = Number(formBody.page)
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        //开启分页
        // 需要联表查询到分类信息
        const posts = await storage.findPopulate4MStorage('all',{},Post,'category',skip,pageSize,false)
        const result = posts.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Post,false,false,false)
       handleSuccess({ res, message: '文章列表分页获取成功', result:{
        count: count.length,
        data:result
       }})
    })()

}

// 获取单个文章
postCtrl.item.GET = ({ params: { post_id }}, res) => {

    (async () => {
      const result = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(post_id) }, Post, false, false, false)

      if (_.isEmpty(result)) {
          handleError({ res, message: '该文章不存在' })
          return false
      }

      handleSuccess({ res, result, message: '该文章获取成功' })
    })()

}

exports.list = (req, res) => { handleRequest({ req, res, controller: postCtrl.list }) }
exports.item = (req, res) => { handleRequest({ req, res, controller: postCtrl.item }) }