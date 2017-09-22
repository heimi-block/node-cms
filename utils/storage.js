const mongoose = require('mongoose')

//4MStorage失败的异常
const errorExceptions =  {
  '400': {'code': 400, 'err': '4MStorageException: Something broke with Mongoose Save!'}
}

/**
 * Name: 4MStorage
 * Author: 程序cat[4mdevstudio]
 * Group: https://www.4-m.cn
 * 4MStorage 基于Mongoose Async Promise构建增删该查API
 * 解决Promise回调问题，简化MongodbCRUD操作
 */

/**
 * #save4MStorage()
 * Saves this document.
 * save$存入之前要做数据格式匹配和矫正
 * 确保这里不会出现err的情况，除非网络或服务器异常[错误码 400]
 * @param model Model创建的对象
 */
const save4MStorage = (model) => {
  return new Promise((resolve, reject) => {
    const result = model.save()
    if(result){
      return resolve(result)
    }else{
      return reject(errorExceptions[400])
    }
  })
}

/**
 * #queryRemove4MStorage()
 * Removes this document from the db.
 * remover$通过某种条件查询到此条数据后，进行删除
 * 然后调用remove()方法即可
 * @param model Model创建的对象
 */
const removeQuery4MStorage = (model) => {
  return new Promise((resolve, reject) => {
    const result = model.remove()
    return resolve(result)
  })
}
/**
 * #conditionRemove4MStorage()
 * Removes this document from the db.
 * remover$直接通过条件进行删除
 * @param condition 条件传入格式{'key': value, 'key': value, ...}
 * #{'_id': mongoose.Types.ObjectId(suboId)}
 * @param Model Model
 */
const removeCondition4MStorage = (Model, condition) => {
  return new Promise((resolve, reject) => {
    const result = Model.remove(condition)
    return resolve(result)
  })
}

/**
 * #update4MStorage()
 * Updates this document.
 * update$ 将查询到的数据封装为新的Model
 * 确保这里不会出现err的情况，除非网络或服务器异常
 * @param model Model查询结果封装的结果对象新model
 */
const update4MStorage = (model) => {
  return new Promise((resolve, reject) => {
    const result = model.save()
    return resolve(result)
  })
}
/**
 * 暂时不添加按条件 Model直接更新符合条件的数据
 */

/**
 * #find4MStorage()
 * 无条件查询表中全部数据
 * Updates this document.
 * update$ 将查询到的数据封装为新的Model
 * @param Model Model
 * @param Type all or one
 * @param Condition 无条件{} 有条件{'key':value, ..}
 * 分页支持
 * @param Skip  number
 * @limit Limit number
 * @sort Sort {'key',1 or -1 } 1:asc -1:desc
 */
const find4MStorage = (Type, Condition, Model, Skip, Limit, Sort) => {
  return new Promise((resolve, reject) => {
    let mql
    if (Type === 'one') {
      mql = Model.findOne(Condition)
    } else {
      mql = Model.find(Condition)
    }
    if(Skip){
      mql.skip(Skip)
    }
    if(Limit){
      mql.limit(Limit)
    }
    if(Sort){
      mql.sort(Sort)
    }
    const result = mql.exec()
    return resolve(result)

  })
}
/**
 * #findWhereEquals4MStorage()
 * 无查询条件，有筛选条件，查询表中全部数据
 * Updates this document.
 * update$ 将查询到的数据封装为新的Model
 * @param Model Model
 * @param wheres wheres 格式 where('upstreamUser').equals(req.subordinate)
 * @param Type all or one
 * Subordinate.find().where('upstreamUser').equals(req.subordinate).populate('balance registeredCategory upstreamUser').exec()
 */
const findWhereEquals4MStorage = (Type, Condition, Model, wheres, equals) => {
  return new Promise((resolve, reject) => {
    if (Type === 'all') {
      const result = Model.find(Condition).where(wheres).equals(equals).exec()
      return resolve(result)
    } else {
      const result = Model.findOne(Condition).where(wheres).equals(equals).exec()
      return resolve(result)
    }
  })
}

/**
 * #findPopulate4MStorage()
 * 无查询条件，无筛选条件，联表查询表中全部数据
 * Updates this document.
 * update$ 将查询到的数据封装为新的Model
 * @param Model Model
 * @param populates populates 格式 'Model Model Model ...'
 * @param Type all or one
 * #Subordinate.find().populate('balance registeredCategory upstreamUser').exec()
 */
const findPopulate4MStorage = (Type, Condition, Model, populates, Skip, Limit, Sort) => {
  return new Promise((resolve, reject) => {

    let mql
    if (Type === 'one') {
      mql = Model.findOne(Condition).populate(populates)
    } else {
      mql = Model.find(Condition).populate(populates)
    }
    if(Skip){
      mql.skip(Skip)
    }
    if(Limit){
      mql.limit(Limit)
    }
    if(Sort){
      mql.sort(Sort)
    }
    const result = mql.exec()
    return resolve(result)
  
  })
}
/**
 * #findPopulateWhereEquals4MStorage()
 * 无查询条件，有筛选条件，联表查询表中全部数据
 * Updates this document.
 * update$ 将查询到的数据封装为新的Model
 * @param Model Model
 * @param populates populates 格式 'Model Model Model ...'
 * @param wheres wheres 格式 where('upstreamUser').equals(req.subordinate)
 * @param Type all or one
 * Subordinate.find().where('upstreamUser').equals(req.subordinate).populate('balance registeredCategory upstreamUser').exec()
 */
const findPopulateWhereEquals4MStorage = (Type, Condition, Model, populates, wheres, equals) => {
  return new Promise((resolve, reject) => {
    if (Type === 'all') {
      const result = Model.find(Condition).where(wheres).equals(equals).populate(populates).exec()
      return resolve(result)
    } else {
      const result = Model.findOne(Condition).where(wheres).equals(equals).populate(populates).exec()
      return resolve(result)
    }
  })
}

module.exports = {
  save4MStorage,
  removeQuery4MStorage,
  removeCondition4MStorage,
  update4MStorage,
  find4MStorage,
  findWhereEquals4MStorage,
  findPopulate4MStorage,
  findPopulateWhereEquals4MStorage
}

