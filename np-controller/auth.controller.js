/*
*
* 权限控制器
*
*/
const _ = require('lodash')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const User = require('np-model/user.model')
const storage = require('np-utils/np-storage')
const secure = require('np-utils/np-secure')
const authIsVerified = require('np-utils/np-auth')
const config = require('np-config')
const jwt = require('jsonwebtoken')
const authCtrl = {}
/**
 * 获取当前请求用户的id
 * const authIsVerified = require('np-utils/np-auth')
 * authIsVerified(req)
 */

// 生成登陆口令Token 及 用户信息
authCtrl.POST = (req, res) => {
    const formBody = req.body || {}
    const email = formBody.email
    const password = formBody.password;
    (async () => {
        let result = await storage.find4MStorage('one', { 'email': email }, User, false, false, false)

        if (_.isEmpty(result)) {
            handleError({ res, result, message: '用户不存在，来者何人!' })
            return
        }

        let checkPwd = await secure.comparePassword(password, result.password)
        if (!checkPwd) {
            handleError({ res, result, message: '密码错误，登录失败' })
            return
        }
        const info = result
        const token = jwt.sign({
            // data: config.AUTH.data,
            data:{
                _id: info._id
            },
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
        }, config.AUTH.jwtTokenSecret)

        handleSuccess({ res, result: { token }, message: '登陆成功' })

    })()

}

authCtrl.GET = (req, res) => {
    if(!authIsVerified(req)){
        handleError({ res, message: 'Token失效或未登录' })
        return false
    };

    (async()=>{
        let result = await storage.find4MStorage('one', { '_id': authIsVerified(req) }, User, false, false, false)
        if(_.isEmpty(result)){
            handleError({ res, message: '用户不存在，错误' })
            return false          
        }
        const info = result
        info.password = 'close your eyes!'
        handleSuccess({ res, result: info, message: '已登录' })
    })()

}

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: authCtrl }) };