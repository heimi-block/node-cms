//无法增加或删除，只有更新操作
//如果程序是第一次运行，那么自动构建一条数据进去
const _ = require('lodash')
const mongoose = require('mongoose')

const storage = require('../utils/storage')
const secure = require('../utils/secure')
const auth = require('../utils/auth')

const Info = require('../models/info.model')

const editInfo = (req, res, next) => {
  const formBody = req.body || {}

  const googleMap = formBody.googleMap
  //前端需要校验经度和纬度是否符合规范
  const contactTel = formBody.contactTel
  const faxNumber = formBody.faxNumber
  const contactEmail = formBody.contactEmail
  const contactAddress = formBody.contactAddress
  const workTime = formBody.workTime
  const copyright = formBody.copyright
  const aboutUs = formBody.aboutUs;

  (async () => {
    //更新信息之前，先去查找数据库是否存在此记录，如果不存在则初始化
    let info = await storage.find4MStorage('one', {}, Info, false, false, false)

    if (info === null) {
      //没有存在，创建即可
      const newInfo = new Info()

      newInfo.contactTel = contactTel
      newInfo.faxNumber = faxNumber
      newInfo.contactEmail = contactEmail
      newInfo.contactAddress = contactAddress
      newInfo.workTime = workTime
      newInfo.copyright = copyright
      newInfo.aboutUs = aboutUs

      let save = await storage.save4MStorage(newInfo)
      if (save.code === 400) {
        res.json({ err: true, message: '联络信息设定更新失败' })
      } else {
        res.json({ err: false, state: "success", message: '联络信息设定更新成功' })
      }
      return
    }

    //存在的话，就执行信息的更新操作
    info.contactTel = contactTel
    info.faxNumber = faxNumber
    info.contactEmail = contactEmail
    info.contactAddress = contactAddress
    info.workTime = workTime
    info.copyright = copyright
    info.aboutUs = aboutUs
    let save = await storage.save4MStorage(info)
    if (save.code === 400) {
      res.json({ err: true, message: '联络信息设定更新失败' })
    } else {
      res.json({ err: false, state: "success", message: '联络信息设定更新成功' })
    }

  })()
}

const getInfo = (req, res, next) => {
  (async () => {

    let info = await storage.find4MStorage('one', {}, Info, false, false, false)
    if (_.isEmpty(info)) {
      // 如果數據庫不存在此記錄，則添加一條初始化
      //没有存在，创建即可
      const newInfo = new Info()

      newInfo.contactTel = ''
      newInfo.faxNumber = ''
      newInfo.contactEmail = ''
      newInfo.contactAddress = ''
      newInfo.workTime = ''
      newInfo.copyright = ''
      newInfo.aboutUs = ''

      let save = await storage.save4MStorage(newInfo)
      if (save.code === 400) {
        res.json({ err: true, message: '联络信息设定更新失败' })
      } else {
        res.json({ err: false, state: "success", message: '联络信息设定初始化成功' })
      }
      return
    }
    res.json({
      err: false, state: "success", message: 'Info信息获取成功', data: {
        googleMap: info.googleMap || '',
        contactTel: info.contactTel || '',
        faxNumber: info.faxNumber || '',
        contactEmail: info.contactEmail || '',
        contactAddress: info.contactAddress || '',
        workTime: info.workTime || '',
        copyright: info.copyright || '',
        aboutUs: info.aboutUs || ''
      }
    })

  })()
}

module.exports = router => {

  router.get('/api/info', auth('A'), getInfo)
  router.post('/api/info', auth('A'), editInfo)

}