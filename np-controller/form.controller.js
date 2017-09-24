/*
*
* 联系表单控制器
*
*/
const _ = require('lodash')
const mongoose = require('mongoose')
const moment = require('moment')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const Form = require('np-model/form.model')
const storage = require('./../np-utils/np-storage')
const formCtrl = { list: {}, item: {} }

// 发布联系表单
formCtrl.list.POST = ({ body: form, body: { realName, email, mobile, address, detail } }, res) => {

    if (realName == undefined || email == undefined || mobile == undefined || address == undefined || detail ==undefined) {
        handleError({ res, message: '联系表单参数不合法' })
        return false
    };

    (async () => {
        const newForm = new Form()
        newForm.realName = realName
        newForm.email = email
        newForm.mobile = mobile
        newForm.address = address
        newForm.detail = detail

        let result = await storage.save4MStorage(newForm)
        handleSuccess({ res, result, message: '联系表单发布成功' })

    })()
}

// 删除联系表单
formCtrl.item.DELETE = ({ params: { form_id } }, res) => {
    (async () => {

        const form = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(form_id) }, Form, false, false, false)

        if (_.isEmpty(form)) {
            handleError({ res, message: '该联系表单不存在' })
            return false
        }

        let result = await storage.removeCondition4MStorage(Form, { '_id': mongoose.Types.ObjectId(form_id) })
        handleSuccess({ res, result, message: '联系表单删除成功' })

    })()
}

// 分页获取所有分类
formCtrl.list.GET = (req, res) => {
    const formBody = req.query || {}
    // 过滤条件
    let page = Number(formBody.page)
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        //开启分页
        const form = await storage.find4MStorage('all',{},Form,skip,pageSize,false)
        const result = form.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Form,false,false,false)
       handleSuccess({ res, message: '联系表单列表分页获取成功', result:{
        count: count.length,
        data:result
       }})
    })()

}

exports.list = (req, res) => { handleRequest({ req, res, controller: formCtrl.list }) }
exports.item = (req, res) => { handleRequest({ req, res, controller: formCtrl.item }) }