//无法增加或删除，只有更新操作
//如果程序是第一次运行，那么自动构建一条数据进去
const _ = require('lodash')
const mongoose = require('mongoose')

const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')

const Meta = require('../models/meta.model')

const editMeta = (req, res, next) => {
  const formBody = req.body || {}

  const description = formBody.description
  const keywords = formBody.keywords
  const themeCss = formBody.themecss
  const headerScript = formBody.headerscript
  const footerScript = formBody.footerscript;

  (async () => {
    //更新信息之前，先去查找数据库是否存在此记录，如果不存在则初始化
    let meta = await storage.find4MStorage('one', {}, Meta, false, false, false)

    if (meta === null) {
      //没有存在，创建即可
      const newMeta = new Meta()
      newMeta.description = description
      newMeta.keywords = keywords
      newMeta.themeCss = themeCss
      newMeta.headerScript = headerScript
      newMeta.footerScript = footerScript

      let save = await storage.save4MStorage(newMeta)
      if (save.code === 400) {
        res.json({ err: true, message: 'META信息更新失败' })
      } else {
        res.json({ err: false, state: "success", message: 'META信息更新成功' })
      }
      return
    }

    //存在的话，就执行信息的更新操作
    meta.description = description
    meta.keywords = keywords
    meta.themeCss = themeCss
    meta.headerScript = headerScript
    meta.footerScript = footerScript
    let save = await storage.save4MStorage(meta)
    if (save.code === 400) {
      res.json({ err: true, message: 'META信息更新失败' })
    } else {
      res.json({ err: false, state: "success", message: 'META信息更新成功' })
    }

  })()
}

const getMeta = (req, res, next) => {
  (async () => {

    let meta = await storage.find4MStorage('one', {}, Meta, false, false, false)
    if (_.isEmpty(meta)) {
      //没有存在，创建即可
      const newMeta = new Meta()
      newMeta.description = ''
      newMeta.keywords = ''
      newMeta.themeCss = ''
      newMeta.headerScript = ''
      newMeta.footerScript = ''

      let save = await storage.save4MStorage(newMeta)
      if (save.code === 400) {
        res.json({ err: true, message: 'META信息更新失败' })
      } else {
        res.json({ err: false, state: "success", message: 'META信息更新成功' })
      }
      return
    }
    res.json({
      err: false, state: "success", message: 'META信息获取成功', data: {
        description: meta.description || '',
        keywords: meta.keywords || '',
        headerscript: meta.headerScript || '',
        footerscript: meta.footerScript || '',
        themecss: meta.themeCss || ''
      }
    })

  })()
}

module.exports = router => {

  router.post('/api/meta', auth('A'), editMeta)
  router.get('/api/meta', auth('A'), getMeta)

}