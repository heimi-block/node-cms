const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const mongoose = require('mongoose')
const RedisStore = require('connect-redis')(session)

// 加载配置项
const config = require('./config/config')
// 懒惰加载 API 路由，需先初始化 MongoDB 连接后引入。

const port = process.env.PORT || 7000

// 初始化
mongoose.Promise = global.Promise
const db = mongoose.connect(config.mongodb,{
  useMongoClient: true,
  /* other options */
})

const app = express()

//模块的引入放在api需要的之后，防止重复

/**
 *api路由放置的顺序是相当重要的，必须放在所有组件之后，express之前
 */

//设置模板引擎
app.set('views', './views')
app.set('view engine', 'ejs')
app.set('trust proxy', 1)

//使用public文件
//views中的模板引入为/public，这里声明必须使用'/public',express.static(path.join(_dirname,'public'))
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//采用第二种不指定public的path,可以直接访问到且路径不需要写public,默认为根路径
//<link rel="stylesheet" href="css/4mcloud.css">
//如何都开启，则都可以访问到

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// 禁用 cookieParser 以防止与 session 中间件的冲突。
// app.use(cookieParser())

// 允许从 URL 参数中获取 session token。
// app.use(function (req, res, next) {
//   console.log(req)
//   next()
// })

app.use(session({
  name: 'a',
  secret: 'Great4-M',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 6000000, httpOnly: false },
  store: new RedisStore(config.redis)
}))

//设置api
app.use('/', require('./routes'))

app.listen(port)

console.log('4MCloudServer started on port ' + port)
console.log('You can know more about this framework (https://express.4-m.cn)')

module.exports = app
