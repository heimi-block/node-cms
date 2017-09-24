/*
*
* 文件控制器
*
*/
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const multer = require('multer')
const pify = require('pify')
const mongoose = require('mongoose')
const moment = require('moment')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const Attachment = require('np-model/attachment.model')
const storage = require('./../np-utils/np-storage')
const attachmentCtrl = { list: {}, item: {} }

// 上传文件
attachmentCtrl.list.POST = (req, res) => {

    if (!req.file) {
        handleError({ res, message: '缺少上传的文件' })
        return false
    };

    (async () => {
        const attachment = new Attachment()
        attachment.extname = path.extname(req.file.originalname);
        attachment.url = `/uploads/${attachment._id.toString()}${attachment.extname}`

        let save = await storage.save4MStorage(attachment)

        pify(fs.rename)(req.file.path, path.join(req.file.destination, attachment._id.toString()) + attachment.extname)

        handleSuccess({ res, message: '上传成功', result:{
        data:{
            _id: save._id,
            url: `/uploads/${attachment._id.toString()}${attachment.extname}`,
            extname: `${attachment.extname}`
        }
       }})
    })()
}

// 删除文件
attachmentCtrl.item.DELETE = ({ params: { attachment_id } }, res) => {
    (async () => {
        let result = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(attachment_id) }, Attachment, false, false, false)

        if (_.isEmpty(result)) {
            handleError({ res, message: '该文件不存在' })
            return false
        }

        try {
            // fixedbug: 更新后图片地址与id不一致，无法删除
            // pify(fs.unlink)(path.join(__dirname, '..', 'uploads', id) + it.extname);
            let fixbug = result.url.split('/')[2].split('.')[0]
            pify(fs.unlink)(path.join(__dirname, '..', 'uploads', fixbug) + result.extname);
        } catch (err) {
            console.error(err);
        }

        result.remove()
        handleSuccess({ res, result, message: '该文件删除成功' })

    })()
}

// 更新单个文件
attachmentCtrl.item.PUT = ({ params: { attachment_id }, body: attachment, body: { lastId, url, extname } }, res) => {

    if (lastId == undefined || url == undefined || extname == undefined) {
        handleError({ res, message: '文件更新参数不合法' })
        return false
    };

    (async () => {
        let result = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(attachment_id) }, Attachment, false, false, false)

        if (_.isEmpty(result)) {
            handleError({ res, message: '未找到此文件' })
            return false
        }
        // 更新前，找到这个文件，先把这个文件删除掉
        try {
            pify(fs.unlink)(path.join(__dirname, '..', 'uploads', attachment_id) + result.extname);
        } catch (err) {
            handleError({ res, err, message: '此文件删除失败' })
            return false
        }
        // 删除后，再更新此记录
        result.url = url
        result.extname = extname
        result.save()
        // 更新完后，删除新上传的那条记录id
        let last = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(lastId) }, Attachment, false, false, false)
        if (_.isEmpty(last)) {
            handleError({ res, message: '未找到此文件' })
            return
        }
        // 删除
        last.remove()
        handleSuccess({ res, message: '该文件删除成功' })

    })()

}

// 分页获取所有文件
attachmentCtrl.list.GET = (req, res) => {
    const formBody = req.query || {}
    // 过滤条件
    let page = Number(formBody.page)
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page-1)*pageSize;

    (async() => {
        //开启分页
        const attachment = await storage.find4MStorage('all',{},Attachment,skip,pageSize,false)
        const result = attachment.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            return jsonObject;
          })
       const count = await storage.find4MStorage('all',{},Attachment,false,false,false)
       handleSuccess({ res, message: '文件列表分页获取成功', result:{
        count: count.length,
        data:result
       }})
    })()

}

exports.list = (req, res) => { handleRequest({ req, res, controller: attachmentCtrl.list }) }
exports.item = (req, res) => { handleRequest({ req, res, controller: attachmentCtrl.item }) }