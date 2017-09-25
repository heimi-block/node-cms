/*
*
* 权限组控制器
*
*/
const _ = require('lodash')
const mongoose = require('mongoose')
const moment = require('moment')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const Group = require('np-model/group.model')
const storage = require('./../np-utils/np-storage')
const groupCtrl = { list: {}, item: {} }

// 发布权限组
groupCtrl.list.POST = ({ body: group, body: { name, privileges } }, res) => {

    if (name == undefined || privileges == undefined) {
        handleError({ res, message: '权限组参数不合法' })
        return false
    };

    (async () => {
        // 验证Name合法性
        let isCorrectly = await storage.find4MStorage('one', { name: name }, Group, false, false, false)
        if (!_.isEmpty(isCorrectly)) {
            handleError({ res, message: '权限组名称已经存在' })
            return false
        }
        const newGroup = new Group()
        newGroup.name = name
        newGroup.privileges = privileges
        let result = await storage.save4MStorage(newGroup)
        handleSuccess({ res, result, message: '权限组发布成功' })

    })()
}

// 删除权限组
groupCtrl.item.DELETE = ({ params: { group_id } }, res) => {
    (async () => {

        const group = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(group_id) }, Group, false, false, false)

        if (_.isEmpty(group)) {
            handleError({ res, message: '该权限组不存在' })
            return false
        }

        let result = await storage.removeCondition4MStorage(Group, { '_id': mongoose.Types.ObjectId(group_id) })
        handleSuccess({ res, result, message: '权限组删除成功' })

    })()
}

// 修改单个权限组
groupCtrl.item.PUT = ({ params: { group_id }, body: group, body: { name, privileges } }, res) => {

  if (name == undefined || privileges == undefined) {
      handleError({ res, message: '权限组参数不合法' })
      return false
  };

    (async () => {
        //验证该权限组是否存在
        const group = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(group_id) }, Group, false, false, false)
        if (_.isEmpty(group)) {
            handleError({ res, message: '该权限组不存在' })
            return false
        }
        // 修改
        group.name = name
        group.privileges = privileges

        let result = await storage.update4MStorage(group)
        handleSuccess({ res, result, message: '权限组修改成功' })
    })()

}

// 分页获取所有权限组
groupCtrl.list.GET = (req, res) => {
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
        let group = []
        if(isPaging === 'false'){
            group = await storage.find4MStorage('all',{},Group,false,false,false)
        }else{
            group = await storage.find4MStorage('all',{},Group,skip,pageSize,false)
        }
        const result = group.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Group,false,false,false)
       handleSuccess({ res, message: '权限组列表分页获取成功', result:{
        count: count.length,
        data:result
       }})
    })()

}

exports.list = (req, res) => { handleRequest({ req, res, controller: groupCtrl.list }) }
exports.item = (req, res) => { handleRequest({ req, res, controller: groupCtrl.item }) }
