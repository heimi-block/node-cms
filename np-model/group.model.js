const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  name: String,  
  privileges: String,
  extra: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group


// 权限组设定说明
// v1.0.0支持的功能
/**
 * Banner  : B --> Banner管理
 * Meta    : M --> Meta管理
 * Info    : I --> 联络信息设定
 * Account : Z --> 账户管理
 * Group   : G --> 权限组管理
 * Post    : P --> 文章分类
 * Categry : C --> 文章编写，获取，更新
 * Forms   : F --> 联系表单
 * Main    : 4 --> 控制面板
 * Attachment: E  --> 附件管理
 * AJAX    : A --> 请求服务端数据权限:默认
 */ 
