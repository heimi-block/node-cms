/*
*
* 分类控制器
*
*/
const _ = require('lodash')
const mongoose = require('mongoose')
const moment = require('moment')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const Category = require('np-model/category.model')
const storage = require('./../np-utils/np-storage')
const categoryCtrl = { list: {}, item: {} }

// 发布分类
categoryCtrl.list.POST = ({ body: category, body: { name } }, res) => {

    if (name == undefined) {
        handleError({ res, message: '缺少分类名称' })
        return false
    };

    (async () => {
        // 验证Name合法性
        let isCorrectly = await storage.find4MStorage('one', { name: name }, Category, false, false, false)
        if (!_.isEmpty(isCorrectly)) {
            handleError({ res, message: '分类名称已经存在' })
            return false
        }
        const newCategory = new Category()
        newCategory.name = name

        let result = await storage.save4MStorage(newCategory)
        handleSuccess({ res, result, message: '分类发布成功' })

    })()
}

// 删除分类
categoryCtrl.item.DELETE = ({ params: { category_id } }, res) => {
    (async () => {

        const category = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(category_id) }, Category, false, false, false)

        if (_.isEmpty(category)) {
            handleError({ res, message: '该分类不存在' })
            return false
        }

        let result = await storage.removeCondition4MStorage(Category, { '_id': mongoose.Types.ObjectId(category_id) })
        handleSuccess({ res, result, message: '分类删除成功' })

    })()
}

// 修改单个分类
categoryCtrl.item.PUT = ({ params: { category_id }, body: category, body: { name } }, res) => {

    if (name == undefined) {
        handleError({ res, message: '分类名称不合法' })
        return false
    };

    (async () => {
        //验证该分类是否存在
        const category = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(category_id) }, Category, false, false, false)
        if (_.isEmpty(category)) {
            handleError({ res, message: '该分类不存在' })
            return false
        }
        // 修改
        category.name = name

        let result = await storage.update4MStorage(category)
        handleSuccess({ res, result, message: '分类修改成功' })
    })()

}

// 分页获取所有分类
categoryCtrl.list.GET = (req, res) => {
    const formBody = req.query || {}
    // 过滤条件
    let page = Number(formBody.page)
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize
    // 是否开启分页
    let isPaging = formBody.isPaging || true;
    (async() => {
        //开启分页
        let category = []
        if(isPaging === 'false'){
            category = await storage.find4MStorage('all',{},Category,false,false,false)
        }else{
            category = await storage.find4MStorage('all',{},Category,skip,pageSize,false)
        }
        const result = category.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Category,false,false,false)
       handleSuccess({ res, message: '分类列表分页获取成功', result:{
        count: count.length,
        data:result
       }})
    })()

}

exports.list = (req, res) => { handleRequest({ req, res, controller: categoryCtrl.list }) }
exports.item = (req, res) => { handleRequest({ req, res, controller: categoryCtrl.item }) }