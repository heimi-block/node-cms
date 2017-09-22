const _ = require('lodash')

const User = require('../models/user.model')
const Group = require('../models/group.model')
const storage = require('./storage')

module.exports = required => {

  return (req, res, next) => {

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
    (async() => {
      let check = await storage.findPopulate4MStorage('one',{'token':token},User,'group',false,false,false)
      if(_.isEmpty(check)){
          reject()
      }else{
             const matched = required.split('').filter(e => check.group.privileges.indexOf(e) >= 0).join('')
        if (required === matched) {
          next()
        } else {
          reject()
        }   
      }
    })()
    //Todo 如果被冻结，ishow 则无法登录
    // User.findOne({'token': token}).exec((err, res) => {
    //   // if (_.isEmpty(res)) {
    //   //   reject()
    //   // } else {
    //   //   const matched = required.split('').filter(e => res.privileges.indexOf(e) >= 0).join('')
    //   //   if (required === matched) {
    //   //     next()
    //   //   } else {
    //   //     reject()
    //   //   }
    //   // }
    // })

  }
}