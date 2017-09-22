const _ = require('lodash')

const mongoose = require('mongoose')
const moment = require('moment')
const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')

const Category = require('../models/category.model')


//API: 添加Category文章分类
const addCategory = (req, res, next) => {

    const formBody = req.body || {}
    const name = formBody.name;
    (async () => {
        
        const newCategory = new Category()
        newCategory.name = name

        let save = await storage.save4MStorage(newCategory)
        if (save.code === 400) {
            res.json({ err: true, message: '文章分类录入失败' })
        } else {
            res.json({ err: false, state: "success", message: '文章分类录入成功' })
        }

    })()
}


//API: 删除文章分类Category
const deleteCategory = (req, res, next) => {

    const formBody = req.query || {}

    const id = formBody.id;

    (async () => {

        const category = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Category, false, false, false)

        if (_.isEmpty(category)) {
            res.json({ err: true, message: '该文章分类不存在' })
            return
        }

        let del = await storage.removeCondition4MStorage(Category, { '_id': mongoose.Types.ObjectId(id) })
        if (del.code === 400) {
            res.json({ err: true, message: '文章分类删除失败' })
        } else {
            res.json({ err: false, state: "success", message: '文章分类删除成功' })
        }

    })()

}

//API: 更新文章分类Category
const editCategory = (req, res, next) => {

    const formBody = req.body || {}

    const id = formBody.id
    const name = formBody.name;

    (async () => {
        //查询该分类是否存在，存在再更新
        const category = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Category, false, false, false)
        if (_.isEmpty(category)) {
            res.json({ err: true, message: '该文章分类不存在' })
            return
        }

        category.name = name

        let save = await storage.update4MStorage(category)
        if (save.code === 400) {
            res.json({ err: true, message: '文章分类更新失败' })
        } else {
            res.json({ err: false, state: "success", message: '文章分类更新成功' })
        }

    })()

}

const getCategorysPaging = (req, res, next) => {
    const formBody = req.query || {}
    let page = Number(formBody.page);
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        // const category = await storage.find4MStorage('all',{},Category,false,false,false)
        //开启分页
        const category = await storage.find4MStorage('all',{},Category,skip,pageSize,false)
        const data = category.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            // jsonObject.key = i;
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Category,false,false,false)          
        res.json({
            err: false, state: "success",  message: 'META信息获取成功', data: data, count: count.length
        }
    )
    })()

}

const getCategorys = (req, res, next) => {
    
    (async() => {
        const category = await storage.find4MStorage('all',{},Category,false,false,false)
        const data = category.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            // jsonObject.key = i;
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Category,false,false,false)          
        res.json({
            err: false, state: "success",  message: 'META信息获取成功', data: data, count: count.length
        }
    )
    })()

}
module.exports = router => {

    router.post('/api/category', auth('A'), addCategory)
    router.delete('/api/category', auth('A'), deleteCategory)

    router.get('/api/categorys/paging', auth('A'), getCategorysPaging)
    router.get('/api/categorys', auth('A'), getCategorys)
    router.put('/api/category', auth('A'), editCategory)
}