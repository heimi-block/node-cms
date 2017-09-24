const mongoose = require('mongoose')
const config = require('np-config')
mongoose.Promise = global.Promise

// 注册mongoose，model创建时调用
exports.mongoose = mongoose

// 数据库配置
exports.connect = () => {
    // 连接数据库
    mongoose.connect(config.MONGODB.uri,config.MONGODB.options)

    // 连接错误
    mongoose.connection.on('error', error => {
		console.log('MongoDB connection failed!', error)        
    })

    // 连接成功
    mongoose.connection.once('open', () => {
        console.log('MongoDB connection success!')
    })

    return mongoose
}
