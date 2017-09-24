'use strict'

// import
const http = require('http')
const helmet = require('helmet')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
require('app-module-path').addPath(__dirname + '/')

// app modules
const config = require('np-config')
const routes = require('np-routes')
const mongodb = require('np-mongodb')
const redis = require('np-redis')
const app = express()

// data server
mongodb.connect()
redis.connect()

// app config
app.set('port', config.APP.PORT)
app.use(helmet())
app.use(bodyParser.json({ limit: '1mb' })) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// global options
//设置模板引擎
app.set('views', './views')
app.set('view engine', 'ejs')
app.set('trust proxy', 1)
//使用public文件
//views中的模板引入为/public，这里声明必须使用'/public',express.static(path.join(_dirname,'public'))
app.use('/public', express.static(path.join(__dirname, 'public')))
// app.use('/', express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
//采用第二种不指定public的path,可以直接访问到且路径不需要写public,默认为根路径
//<link rel="stylesheet" href="css/4mcloud.css">
//如何都开启，则都可以访问到

// app routes
routes(app)
// app.use('/', require('./routes'))

// Start server
http.createServer(app).listen(app.get('port'), () => {
	console.log(`4MEfficient RestfulAPI framework Run！port at ${app.get('port')}`)
})
