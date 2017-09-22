const path = require('path')
const mongoose = require('mongoose')
const moment = require('moment')
const fs = require('fs')
const _ = require('lodash')

const multer = require('multer')
const pify = require('pify')

const storage = require('../utils/storage')
const Attachment = require('../models/attachment.model')
const auth = require('../utils/auth')
/**
 * 4MCloudServer
 * Upload File CommonJS
 */

const addAttachment = (req, res, next) => {

    if (!req.file) {
        res.json({ err: true })
        return
    };

    (async () => {

        const attachment = new Attachment()
        attachment.extname = path.extname(req.file.originalname);
        attachment.url = `/uploads/${attachment._id.toString()}${attachment.extname}`

        let save = await storage.save4MStorage(attachment)

        console.log(save)

        pify(fs.rename)(req.file.path, path.join(req.file.destination, attachment._id.toString()) + attachment.extname)

        if (save.code === 400) {
            res.json({ err: true, message: '上传失败' })
        } else {
            res.json({
                err: false, state: "success",
                _id: save._id,
                url: `/uploads/${attachment._id.toString()}${attachment.extname}`,
                extname: `${attachment.extname}`
            })
        }

    })()

}

const getAttachments = (req, res, next) => {

    (async () => {
        let find = await storage.find4MStorage('all', {}, Attachment, false, false, false)

        if (find.code === 400) {
            res.json({ err: true, message: '获取失败' })
        } else {
            res.json({ err: false, state: "success", data: find })
        }

    })()

}

const getAttachmentsPaging = (req, res, next) => {
    const formBody = req.query || {}
    let page = Number(formBody.page)
    // let pageSize = Number(formBody.pageSize)
    let pageSize = 10
    // let sort = formBody.sort
    let skip = (page - 1) * pageSize;

    (async () => {
        // const attachment = await storage.find4MStorage('all',{},Attachment,false,false,false)
        //开启分页
        const attachment = await storage.find4MStorage('all', {}, Attachment, skip, pageSize, false)
        const data = attachment.map((e, i) => {
            const jsonObject = Object.assign({}, e._doc)
            jsonObject.createdAt = moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
            // jsonObject.key = i;
            return jsonObject;
        })
        const count = await storage.find4MStorage('all', {}, Attachment, false, false, false)
        res.json({
            err: false, state: "success", message: '媒体及附件获取成功', data: data, count: count.length
        }
        )
    })()

}

const deleteAttachment = (req, res, next) => {

    const id = req.query.id;

    (async () => {
        let it = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Attachment, false, false, false)

        if (_.isEmpty(it)) {
            res.json({ err: true, message: '未找到此文件' })
            return
        }

        try {
            // 解决 更新后图片地址与id不一致，无法删除
            // pify(fs.unlink)(path.join(__dirname, '..', 'uploads', id) + it.extname);
            let fixbug = it.url.split('/')[2].split('.')[0]
            pify(fs.unlink)(path.join(__dirname, '..', 'uploads', fixbug) + it.extname);        
        } catch (err) {
            console.error(err);
        }

        it.remove()
        res.json({ err: false, state: "success" })

    })()

}

const editAttachment = (req, res, next) => {
    const formBody = req.body || {}

    const id = formBody.id
    const lastId = formBody.lastId
    const url = formBody.url
    const extname = formBody.extname;

    // /**
    //  * eg: note 为额外存放的字段，可以增加多个
    //  */
    // const note = formBody.note;

    (async () => {
        let it = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(id) }, Attachment, false, false, false)

        if (_.isEmpty(it)) {
            res.json({ err: true, message: '未找到此文件' })
            return
        }
        //找到这个文件，更新前，先把这个文件的图片删除掉
        try {
            pify(fs.unlink)(path.join(__dirname, '..', 'uploads', id) + it.extname);
        } catch (err) {
            console.error(err);
                        return
        }
        // 删除后，再更新此记录
        it.url = url
        it.extname = extname
        it.save();
        //更新完后，删除新上传的那条记录id
        let last = await storage.find4MStorage('one', { '_id': mongoose.Types.ObjectId(lastId) }, Attachment, false, false, false)

        if (_.isEmpty(last)) {
            res.json({ err: true, message: '未找到此文件' })
            return
        }

        last.remove()

        res.json({ err: false, state: "success", message: '更新文件或媒体成功' })

    })()

}

module.exports = router => {
    const upload = multer({ dest: path.join(__dirname, '..', 'uploads') })
    router.get('/api/attachments/paging', auth('A'), getAttachmentsPaging)
    router.delete('/api/attachment', auth('A'), deleteAttachment)
    router.put('/api/attachment', editAttachment)

    router.get('/api/attachment', getAttachments)
    router.post('/api/attachment', upload.single('upfile'), addAttachment)



}