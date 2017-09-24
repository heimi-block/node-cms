// 路由管理

const config = require('./np-config')
const controller = require('./np-controller')
const authIsVerified = require('np-utils/np-auth')
const multer = require('multer')
const path = require('path')
const routes = app => {

    // 全局拦截器
    app.all('*', (req, res, next) => {
        // Set Header
        const allowedOrigins = ['https://cms.4-m.cn', 'https://www.4-m.cn', 'http://cms.4-m.cn', 'http://127.0.0.1:7070'];
        const origin = req.headers.origin || ''
        if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
            res.setHeader('Access-Control-Allow-Origin', origin)
        }
        res.header('Access-Control-Allow-Headers', 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With, X-MC-TOKEN');
        res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS');
        res.header('Access-Control-Max-Agse', '1728000');
        res.header('Content-Type', 'application/json;charset=utf-8');
        res.header('X-Powered-By', 'Nodepress 1.0.0');

        // 排除auth的post请求
		const isPostAuth = Object.is(req.url, '/auth') && Object.is(req.method, 'POST');
		if (isPostAuth) {
			next()
			return false
        }

        // 拦截所有非get请求
		if (!authIsVerified(req) && !Object.is(req.method, 'GET')) {
			res.status(401).jsonp({ code: 0, message: '来者何人！' })
			return false
        }
        
        next()
    })

    // Api
    app.get('/', (req, res) => {
        res.jsonp(config.INFO)
    })

    // Auth
    app.all('/auth', controller.auth)

    // Category
    app.all('/category', controller.category.list)
    app.all('/category/:category_id', controller.category.item)

    // Attachment [设定上传的路径. ..]
    const upload = multer({ dest: path.join(__dirname, '.', 'uploads') })
    app.all('/attachment', upload.single('upfile'), controller.attachment.list)
    app.all('/attachment/:attachment_id', controller.attachment.item)
    
    // 404
    app.all('*', (req, res) => {
        res.status(404).jsonp({
            code: 0,
            message: '无效的API请求'
        })
    })

}

module.exports = routes