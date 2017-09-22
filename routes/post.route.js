const _ = require('lodash')

const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')
const mongoose = require('mongoose')
const moment = require('moment')
const Post = require('../models/post.model')

//API:添加文章Post
const addPost = (req, res, next) => {

    const formBody = req.body || {}
    
    const category = formBody.category
    const title = formBody.title
    const coverUrl = formBody.coverUrl
    const content = formBody.content
    const isShow  = formBody.isShow;

    (async () => {

        const newPost = new Post()
        newPost.category = category
        newPost.title = title
        newPost.coverUrl = coverUrl
        newPost.content = content
        newPost.isShow = isShow

        let save = await storage.save4MStorage(newPost)
        if (save.code === 400) {
            res.json({ err: true, message: '文章发表失败' })
        } else {
            res.json({ err: false, state: "success", message: '文章发表成功' })
        }

    })()
}


//API: 删除文章Post
const deletePost = (req, res, next) => {

    const formBody = req.query || {}

    const id = formBody.id;

    (async () => {

        const post = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Post, false, false, false)

        if (_.isEmpty(post)) {
            res.json({ err: true, message: '该文章不存在' })
            return
        }

        let del = await storage.removeCondition4MStorage(Post, { '_id': mongoose.Types.ObjectId(id) })
        if (del.code === 400) {
            res.json({ err: true, message: '文章删除失败' })
        } else {
            res.json({ err: false, state: "success", message: '文章删除成功' })
        }

    })()

}

//API: 更新文章Post
const editPost = (req, res, next) => {

    const formBody = req.body || {}

    const id = formBody.id
    const category = formBody.category
    const title = formBody.title
    const coverUrl = formBody.coverUrl
    const content = formBody.content
    const isShow  = formBody.isShow;

    (async () => {
        //查询该文章是否存在，存在再更新
        const post = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Post, false, false, false)
        if (_.isEmpty(post)) {
            res.json({ err: true, message: '该文章不存在' })
            return
        }

        post.category = category
        post.title = title
        post.coverUrl = coverUrl
        post.content = content
        post.isShow = isShow

        let save = await storage.update4MStorage(post)
        if (save.code === 400) {
            res.json({ err: true, message: '文章更新失败' })
        } else {
            res.json({ err: false, state: "success", message: '文章更新成功' })
        }

    })()

}

//API: 获取文章列表信息
const getPostsPaging = (req, res, next) => {

    const formBody = req.query || {}
    let page = Number(formBody.page);
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        // const posts = await storage.find4MStorage('all',{},Post,false,false,false)
       // 需要联表查询到分类信息 
        const posts = await storage.findPopulate4MStorage('all',{},Post,'category',skip,pageSize,false)
        const data = posts.map((e, i) => {
          const jsonObject = Object.assign({}, e._doc)
          jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
        //   jsonObject.key = i;
          return jsonObject
        })
        const count = await storage.find4MStorage('all',{},Post,false,false,false)          
        res.json({
            err: false, state: "success",  message: '文章列表获取成功', data: data, count: count.length
        })
    })()

}

const getPosts = (req, res, next) => {

        (async() => {
            const posts = await storage.find4MStorage('all',{},Post,false,false,false)
            const data = posts.map((e, i) => {
              const jsonObject = Object.assign({}, e._doc)
              jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            //   jsonObject.key = i;
              return jsonObject
            })       
            res.json({
                err: false, state: "success",  message: '文章列表获取成功', data: data
            })
        })()
    
    }

//API: 获取单个文章的信息

const getPost = (req, res, next) => {

    const formBody = req.query || {}
    const id = formBody.id;

    (async()=>{
        //查询该文章是否存在
        const post = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Post, false, false, false)
        if (_.isEmpty(post)) {
            res.json({ err: true, message: '该文章不存在' })
            return
        }
        res.json({ err: false, message: '文章信息获取成功', data: post })

    })()

}

module.exports = router => {
    // 单个文章的具体信息
    router.get('/api/post', auth('A'), getPost)
    router.get('/api/posts', auth('A'), getPosts)
    router.get('/api/posts/paging', auth('A'), getPostsPaging)
    router.post('/api/post', auth('A'), addPost)
    router.put('/api/post', auth('A'), editPost)
    router.delete('/api/post', auth('A'), deletePost)

}