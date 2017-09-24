/*
*
* 用户控制器
*
*/
const _ = require('lodash')
const mongoose = require('mongoose')
const moment = require('moment')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const User = require('np-model/user.model')
const storage = require('np-utils/np-storage')
const secure = require('np-utils/np-secure')
const userCtrl = { list: {}, item: {} }

// 发布用户
userCtrl.list.POST = ({ body: user, body: { email, password, group, isShow } }, res) => {

    //中國台灣地區
    if (!(/^[\.a-zA-Z0-9\u4e00-\u9fa5_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
        handleError({ res, message: '邮箱格式错误' })
        return false
    }
    if (!(/^.{6,12}$/.test(password))) {
        handleError({ res, message: '密码不符合规范，需要 6 - 12 个字符' })
        return false
    }
    if (_.isEmpty(group)) {
        handleError({ res, message: '不支持所选角色' })
        return false
    };

    (async () => {
        // 验证Name合法性
        let isCorrectly = await storage.find4MStorage('one', { email: email }, User, false, false, false)
        if (!_.isEmpty(isCorrectly)) {
            handleError({ res, message: '该邮箱地址已被注册' })
            return false
        }
        const newUser = new User()
        newUser.email = email
        newUser.group = group
        newUser.isShow = isShow
        newUser.password = await secure.cryptPassword(password)

        let result = await storage.save4MStorage(newUser)
        handleSuccess({ res, result, message: '用户发布成功' })

    })()
}

// 删除用户
userCtrl.item.DELETE = ({ params: { user_id } }, res) => {
    (async () => {

        const user = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(user_id) }, User, false, false, false)

        if (_.isEmpty(user)) {
            handleError({ res, message: '该用户不存在' })
            return false
        }

        let result = await storage.removeCondition4MStorage(User, { '_id': mongoose.Types.ObjectId(user_id) })
        handleSuccess({ res, result, message: '用户删除成功' })

    })()
}

// 修改单个用户
userCtrl.item.PUT = ({ params: { user_id }, body: user, body: { email, password, group, isShow } }, res) => {

    //中國台灣地區
    if (!(/^[\.a-zA-Z0-9\u4e00-\u9fa5_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
        handleError({ res, message: '邮箱格式错误' })
        return false
    }
    if (!(/^.{6,12}$/.test(password))) {
        handleError({ res, message: '密码不符合规范，需要 6 - 12 个字符' })
        return false
    }
    if (_.isEmpty(group)) {
        handleError({ res, message: '不支持所选角色' })
        return false
    };

    (async () => {
        //验证该用户是否存在
        const user = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(user_id) }, User, false, false, false)
        if (_.isEmpty(user)) {
            handleError({ res, message: '该用户不存在' })
            return false
        }
        // 验证Name合法性
        let isCorrectly = await storage.find4MStorage('one', { email: email }, User, false, false, false)
        if (!_.isEmpty(isCorrectly)) {
            handleError({ res, message: '该邮箱地址已被注册' })
            return false
        }

        // 修改
        user.email = email
        user.password = await secure.cryptPassword(password)
        user.group = group
        user.isShow = isShow

        let result = await storage.update4MStorage(user)
        handleSuccess({ res, result, message: '用户修改成功' })
    })()

}

// 分页获取所有用户
userCtrl.list.GET = (req, res) => {
    const formBody = req.query || {}
    // 过滤条件
    let page = Number(formBody.page)
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page - 1) * pageSize;

    (async () => {
        //开启分页
        const user = await storage.findPopulate4MStorage('all', {}, User, 'group', skip, pageSize, false)
        const result = user.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            return jsonObject;
        })
        const count = await storage.find4MStorage('all', {}, User, false, false, false)
        handleSuccess({
            res, message: '用户列表分页获取成功', result: {
                count: count.length,
                data: result
            }
        })
    })()

}

exports.list = (req, res) => { handleRequest({ req, res, controller: userCtrl.list }) }
exports.item = (req, res) => { handleRequest({ req, res, controller: userCtrl.item }) }
