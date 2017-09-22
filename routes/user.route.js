const _ = require('lodash')

const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')

const User = require('../models/user.model')
const Group = require('../models/group.model')

const mongoose = require('mongoose')
const moment = require('moment')

//API: 添加用户
const addUser = (req, res, next) => {

  const formBody = req.body || {}

  const email = formBody.email
  const password = formBody.password
  const group = formBody.group
  const isShow = formBody.isShow

  //中國台灣地區
  if (!(/^[\.a-zA-Z0-9\u4e00-\u9fa5_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
    res.json({err: false, message: '邮箱格式错误'})
    return;
  }
  if (!(/^.{6,12}$/.test(password))) {
    res.json({err: true, message: '密码不符合规范，需要 6 - 12 个字符'})
    return
  }
  if (_.isEmpty(group)) {
    res.json({err: true, message: '不支持所选角色'})
    return
  };

  (async()=>{
    //查询该用户是否已经被注册
    let user = await storage.find4MStorage('one',{'email': email},User,false,false,false)
    if(!_.isEmpty(user)){
      res.json({err: true, message: '该邮箱地址已被注册'})
      return
    }

    const newUser = new User()
    newUser.email = email
    newUser.group = group
    newUser.isShow = isShow
    newUser.password = await secure.cryptPassword(password)

    let save = await storage.save4MStorage(newUser)
    if(save.code === 400){
      res.json({err: true, message: '用户注册失败'})
    }else{
      res.json({err: false, state: "success",  message: '用户注册成功'})
    }

  })()

}

//API: 更新用户
const editUser = (req, res, next) => {

  const formBody = req.body || {}

  const id = formBody.id
  const email = formBody.email
  const password = formBody.password
  const group = formBody.group
  const isShow = formBody.isShow

  //中國台灣地區
  if (!(/^[\.a-zA-Z0-9\u4e00-\u9fa5_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email))) {
    res.json({err: false, message: '邮箱格式错误'})
    return;
  }

  if (_.isEmpty(group)) {
    res.json({err: true, message: '不支持所选角色'})
    return
  };

  (async()=>{
    //查询该用户是否存在，存在再更新
    const user = await storage.find4MStorage('one',{ '_id' : mongoose.Types.ObjectId(id) },User,false,false,false)
    if(_.isEmpty(user)){
      res.json({err: true, message: '该用户不存在'})
      return
    }

    user.email = email
    user.password = await secure.cryptPassword(password)
    user.group  = group
    user.isShow = isShow

    let save = await storage.update4MStorage(user)
    if(save.code === 400){
      res.json({err: true, message: '用户更新失败'})
    }else{
      res.json({err: false, state: "success", message: '用户更新成功'})
    }

  })()


}

//API: 删除用户
const deleteUser = (req, res, next) => {

  const formBody = req.query || {}

  const id = formBody.id;

  (async()=>{

    const user = await storage.find4MStorage('one',{ '_id' : mongoose.Types.ObjectId(id) },User,false,false,false)

    if (_.isEmpty(user)) {
      res.json({err: true, message: '该用户不存在'})
      return
    }

    let del = await storage.removeCondition4MStorage(User,{'_id':user._id})
    if(del.code === 400){
      res.json({err: true, message: '用户删除失败'})
    }else{
      res.json({err: false, state: "success", message: '用户删除成功'})
    }

  })()

}

const getUser = (req, res, next) => {
  
  const formBody = req.query || {}

  const id = formBody.id;

  (async() => {
    const user = await storage.find4MStorage('one',{'_id':id},User,false,false,false)
    
        if (_.isEmpty(user)) {
          res.json({err: true, message: '该用户不存在'})
          return
        }

        res.json({err: true, status: 'success', data: user})
      
  })
}

//API: 获取用户
const getUsers = (req, res, next) => {
  
    (async() => {
      const users = await storage.find4MStorage('all',{},User,false,false,false)
      res.json(users.map((e, i) => {
        const jsonObject = Object.assign({}, e._doc);
        jsonObject.key = i;
        return jsonObject;
      }));
    })()
  
}

const getUsersPaging = (req, res, next) => {
  
      const formBody = req.query || {}
      let page = Number(formBody.page);
      // let pageSize = Number(formBody.pageSize)
      let pageSize = 10
      // let sort = formBody.sort
      let skip = (page-1)*pageSize;
  
      (async() => {
          // const posts = await storage.find4MStorage('all',{},Post,false,false,false)
         // 需要联表查询到分类信息 
          const users = await storage.findPopulate4MStorage('all',{},User,'group',skip,pageSize,false)
          const data = users.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
          //   jsonObject.key = i;
            return jsonObject
          })
          const count = await storage.find4MStorage('all',{},User,false,false,false)          
          res.json({
              err: false, state: "success",  message: '用户列表获取成功', data: data, count: count.length
          })
      })()
  
  }

module.exports = router => {
  router.post('/api/user', addUser)
  router.get('/api/users', auth('A'), getUsers)
  router.get('/api/users/paging', auth('A'), getUsersPaging)

  router.get('/api/user', auth('A'), getUser)
  
  router.put('/api/user', auth('A'), editUser)
  router.delete('/api/user', auth('A'), deleteUser)
}
