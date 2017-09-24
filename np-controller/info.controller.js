/*
*
* Info控制器
* 无增加或删除，只有更新操作
* 如果程序是第一次运行，那么自动构建一条数据进去
*
*/
const _ = require('lodash')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const Info = require('np-model/info.model')
const storage = require('./../np-utils/np-storage')
const infoCtrl = {}

// 获取InfoJs
infoCtrl.GET = (req, res) => {
    (async () => {

        let info = await storage.find4MStorage('one', {}, Info, false, false, false)

        if (_.isEmpty(info)) {

            // 没有存在，创建即可
            const newInfo = new Info()
            newInfo.contactTel = ''
            newInfo.faxNumber = ''
            newInfo.contactEmail = ''
            newInfo.contactAddress = ''
            newInfo.workTime = ''
            newInfo.copyright = ''
            newInfo.aboutUs = ''

            let result = await storage.save4MStorage(newInfo)
            handleSuccess({ res, result, message: 'INFO配置项初始化成功' })
            return
        }

        handleSuccess({
            res, message: '配置项获取成功',
            result: {
                data: {
                    googleMap: info.googleMap || '',
                    contactTel: info.contactTel || '',
                    faxNumber: info.faxNumber || '',
                    contactEmail: info.contactEmail || '',
                    contactAddress: info.contactAddress || '',
                    workTime: info.workTime || '',
                    copyright: info.copyright || '',
                    aboutUs: info.aboutUs || ''
                }
            }
        })

    })()
}

// 修改Info
infoCtrl.PUT = ({ body: info, body: { contactTel, faxNumber, contactEmail, contactAddress, workTime, copyright, aboutUs } }, res) => {

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

            let result = await storage.save4MStorage(newInfo)
            handleSuccess({ res, result, message: 'INFO配置项初始化成功' })
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
        let result = await storage.save4MStorage(info)
        handleSuccess({ res, result, message: 'INFO配置项修改成功' })

    })()

}



module.exports = (req, res) => { handleRequest({ req, res, controller: infoCtrl }) }
