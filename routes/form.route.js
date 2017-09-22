const _ = require('lodash')

const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')
const moment = require('moment')
const mongoose = require('mongoose')
const Form = require('../models/form.model')

//API: 添加联系表单
const addForm = (req, res, next) => {

    const formBody = req.body || {}

    const realName = formBody.realName
    const email = formBody.email
    const mobile = formBody.mobile
    const address = formBody.address
    const detail = formBody.detail;

    (async () => {
        const newForm = new Form()
        newForm.realName = realName
        newForm.email = email
        newForm.mobile = mobile
        newForm.address = address
        newForm.detail = detail

        let save = await storage.save4MStorage(newForm)
        if (save.code === 400) {
            res.json({ err: true, message: '联系表单提交失败' })
        } else {
            res.json({ err: false, state: "success", message: '联系表单提交成功' })
        }

    })()
}


//API: 删除联系表单
const deleteForm = (req, res, next) => {

    const formBody = req.query || {}

    const id = formBody.id;

    (async () => {

        const form = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Form, false, false, false)

        if (_.isEmpty(form)) {
            res.json({ err: true, message: '该联系表单不存在' })
            return
        }

        let del = await storage.removeCondition4MStorage(Form, { '_id': mongoose.Types.ObjectId(id) })
        if (del.code === 400) {
            res.json({ err: true, message: '联系表单删除失败' })
        } else {
            res.json({ err: false, state: "success", message: '联系表单删除成功' })
        }

    })()

}

//API: 获取联系表单
const getFormsPaging = (req, res, next) => {

    const formBody = req.query || {}
    let page = Number(formBody.page);
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        // const category = await storage.find4MStorage('all',{},Form,false,false,false)
        //开启分页
        const forms = await storage.find4MStorage('all',{},Form,skip,pageSize,false)
        const data = forms.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            // jsonObject.key = i;
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Form,false,false,false)          
        res.json({
            err: false, state: "success",  message: '联系表单信息获取成功', data: data, count: count.length
        }
    )
    })()

}



module.exports = router => {
    // router.get('/api/forms', auth('A'), getForms)
    router.get('/api/forms/paging', auth('A'), getFormsPaging)

    router.post('/api/form', addForm)
    router.delete('/api/form', auth('A'), deleteForm)

}