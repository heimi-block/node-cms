/**
 * Created by cyandev on 2017/3/25.
 */
const crypto = require('crypto') //加密算法node.js

const _ = require('lodash')
const router = require('express').Router()

const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')

const User = require('../models/user.model')

//注册路由区域
require('./user.route')(router)
require('./banner.route')(router)
require('./meta.route')(router)
require('./info.route')(router)
require('./category.route')(router)
require('./group.route')(router)
require('./attachment.route')(router)
require('./post.route')(router)
require('./form.route')(router)
require('./google.route')(router)

//登录接口
router.post('/user/session', (req, res, next) => {
  const formBody = req.body || {}

  const email = formBody.email
  const password = formBody.password;

  (async () => {
    let user = await storage.find4MStorage('one', {'email': email}, User, false, false, false)
    if (_.isEmpty(user)) {
      res.json({err: true, message: '用户不存在或密码错误。'})
      return
    }

    let checkPwd = await secure.comparePassword(password, user.password)
    if (!checkPwd) {
      res.json({err: true, message: '用户不存在或密码错误。'})
      return
    }

    const hash = crypto.createHash('sha256')
    hash.update(`${user._id}.${password}.${Date.now()}`)
    const token = hash.digest().toString('hex')

    user.token = token
    let info = await storage.save4MStorage(user)
    info.password = 'close your eyes!'

    res.json({err: false, message: '登录成功', data: {
      token: token,
      info: info
    }})

  })()
})
// 检测登录
router.get('/user/checkLogin', (req, res, next) => {
    const reject = () => {
    res.json({err: true, message: '权限不足或Token失效'})
    res.end()
    }
    //用户登录后，请将返回的Token存入LocalStorage,请求时支持Header/Req,推荐使用Header
    //用户登出，请清空浏览器LocalStorage
    const token = req.header('X-MC-TOKEN') || req.query.token
    if (_.isEmpty(token)) {
      reject()
      return
    };

    //根据传入的token,验证是否有效并查询改用户权限
    (async () => {
      let user = await storage.find4MStorage('one', {'token': token}, User, false, false, false)
      if (_.isEmpty(user)) {
        reject()
        return
      }
      user.token = token  
      res.json({err: false, message: '检测成功', data: {
        token: token,
        info: user
      }})
  
    })()  
})

// 退出登录
router.get('/user/loginOut', (req, res, next) => {
  const reject = () => {
  res.json({err: true, message: '权限不足或Token失效'})
  res.end()
  }
  //用户登录后，请将返回的Token存入LocalStorage,请求时支持Header/Req,推荐使用Header
  //用户登出，请清空浏览器LocalStorage
  const token = req.header('X-MC-TOKEN') || req.query.token
  if (_.isEmpty(token)) {
    reject()
    return
  };

  //根据传入的token,验证是否有效并查询改用户权限
  (async () => {
    let user = await storage.find4MStorage('one', {'token': token}, User, false, false, false)
    if (_.isEmpty(user)) {
      reject()
      return
    }
    user.token = ''
    user.save()  
    res.json({err: false, message: '退出成功'})

  })()  
})

module.exports = router
