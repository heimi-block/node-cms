/*
*
* Meta控制器
* 无增加或删除，只有更新操作
* 如果程序是第一次运行，那么自动构建一条数据进去
*
*/
const _ = require('lodash')
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const Meta = require('np-model/meta.model')
const storage = require('./../np-utils/np-storage')
const metaCtrl = {}

// 获取MetaJs
metaCtrl.GET = (req, res) => {
    (async () => {

        let meta = await storage.find4MStorage('one', {}, Meta, false, false, false)

        if (_.isEmpty(meta)) {

            // 没有存在，创建即可
            const newMeta = new Meta()
            newMeta.description = ''
            newMeta.keywords = ''
            newMeta.themeCss = ''
            newMeta.headerScript = ''
            newMeta.footerScript = ''

            let result = await storage.save4MStorage(newMeta)
            handleSuccess({ res, result, message: 'META配置项初始化成功' })
            return
        }

        handleSuccess({
            res, message: '配置项获取成功',
            result: {
                data: {
                    description: meta.description || '',
                    keywords: meta.keywords || '',
                    headerscript: meta.headerScript || '',
                    footerscript: meta.footerScript || '',
                    themecss: meta.themeCss || ''
                }
            }
        })

    })()
}

// 修改Meta
metaCtrl.PUT = ({ body: meta, body: { description, keywords, themecss, headerscript, footerscript }}, res) => {

    (async () => {
        //更新信息之前，先去查找数据库是否存在此记录，如果不存在则初始化
        let meta = await storage.find4MStorage('one', {}, Meta, false, false, false)
    
        if (meta === null) {
          //没有存在，创建即可
          const newMeta = new Meta()
          newMeta.description = description
          newMeta.keywords = keywords
          newMeta.themeCss = themecss
          newMeta.headerScript = headerscript
          newMeta.footerScript = footerscript
    
          let result = await storage.save4MStorage(newMeta)
          handleSuccess({ res, result, message: 'META配置项初始化成功' })
          return
        }
    
        //存在的话，就执行信息的更新操作
        meta.description = description
        meta.keywords = keywords
        meta.themeCss = themecss
        meta.headerScript = headerscript
        meta.footerScript = footerscript
        let result = await storage.save4MStorage(meta)
        handleSuccess({ res, result, message: 'META配置项修改成功' })
    
      })()
      
}



module.exports = (req, res) => { handleRequest({ req, res, controller: metaCtrl }) }