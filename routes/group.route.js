const _ = require('lodash')

const mongoose = require('mongoose')
const moment = require('moment')
const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')

const Group = require('../models/group.model')


//API: 添加Group权限组别
const addGroup = (req, res, next) => {

    const formBody = req.body || {}
    const privileges = formBody.privileges
    const name = formBody.name;
    (async () => {

        const newGroup = new Group()
        newGroup.name = name
        newGroup.privileges = privileges
        let save = await storage.save4MStorage(newGroup)
        if (save.code === 400) {
            res.json({ err: true, message: '权限组别录入失败' })
        } else {
            res.json({ err: false, state: "success", message: '权限组别录入成功' })
        }

    })()
}


//API: 删除权限组别Group
const deleteGroup = (req, res, next) => {

    const formBody = req.query || {}

    const id = formBody.id;

    (async () => {

        const group = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Group, false, false, false)

        if (_.isEmpty(group)) {
            res.json({ err: true, message: '该权限组别不存在' })
            return
        }

        let del = await storage.removeCondition4MStorage(Group, { '_id': mongoose.Types.ObjectId(id) })
        if (del.code === 400) {
            res.json({ err: true, message: '权限组别删除失败' })
        } else {
            res.json({ err: false, state: "success", message: '权限组别删除成功' })
        }

    })()

}

//API: 更新权限组别Group
const editGroup = (req, res, next) => {

    const formBody = req.body || {}

    const id = formBody.id
    const privileges = formBody.privileges
    const name = formBody.name;

    (async () => {
        //查询该分类是否存在，存在再更新
        const group = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Group, false, false, false)
        if (_.isEmpty(group)) {
            res.json({ err: true, message: '该权限组别不存在' })
            return
        }

        group.name = name
        group.privileges = privileges

        let save = await storage.update4MStorage(group)
        if (save.code === 400) {
            res.json({ err: true, message: '权限组别更新失败' })
        } else {
            res.json({ err: false, state: "success", message: '权限组别更新成功' })
        }

    })()

}

const getGroupsPaging = (req, res, next) => {
    const formBody = req.query || {}
    let page = Number(formBody.page);
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        // const group = await storage.find4MStorage('all',{},Group,false,false,false)
        //开启分页
        const group = await storage.find4MStorage('all',{},Group,skip,pageSize,false)
        const data = group.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            // jsonObject.key = i;
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Group,false,false,false)
        res.json({
            err: false, state: "success",  message: '权限组别信息获取成功', data: data, count: count.length
        }
    )
    })()

}

const getGroups = (req, res, next) => {

    (async() => {
        const group = await storage.find4MStorage('all',{},Group,false,false,false)
        const data = group.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            // jsonObject.key = i;
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Group,false,false,false)
        res.json({
            err: false, state: "success",  message: '权限组别信息获取成功', data: data, count: count.length
        }
    )
    })()

}
module.exports = router => {

    router.post('/api/group', auth('A'), addGroup)
    router.delete('/api/group', auth('A'), deleteGroup)

    router.get('/api/groups/paging', auth('A'), getGroupsPaging)
    router.get('/api/groups', auth('A'), getGroups)
    router.put('/api/group', auth('A'), editGroup)
}
