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
        res.header('Access-Control-Allow-Headers', 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With, X-MC-TOKEN')
        res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS')
        res.header('Access-Control-Max-Agse', '1728000')
        res.header('Content-Type', 'application/json;charset=utf-8')
        res.header('X-Powered-By', 'Nodepress 1.0.0')

        // OPTIONS
        if (req.method == 'OPTIONS') {
            res.sendStatus(200)
            return false
        }

        // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
        if (Object.is(process.env.NODE_ENV, 'production')) {
            const { origin, referer } = req.headers;
            const originVerified = (!origin || origin.includes('cms.4-m.cn')) &&
                (!referer || referer.includes('cms.4-m.cn'))
            if (!originVerified) {
                res.status(403).jsonp({ code: 0, message: '来者何人！' })
                return false;
            }
        }

        // 排除auth的post请求
        const isPostAuth = Object.is(req.url, '/api/auth') && Object.is(req.method, 'POST');
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
    app.get('/api', (req, res) => {
        res.jsonp(config.INFO)
    })

    // Auth
    app.all('/api/auth', controller.auth)

    // Category
    app.all('/api/category', controller.category.list)
    app.all('/api/category/:category_id', controller.category.item)

    // Banner
    app.all('/api/banner', controller.banner.list)
    app.all('/api/banner/:banner_id', controller.banner.item)

    // Group
    app.all('/api/group', controller.group.list)
    app.all('/api/group/:group', controller.group.item)

    // Form
    app.all('/api/form', controller.form.list)
    app.all('/api/form/:form_id', controller.form.item)

    // Post
    app.all('/api/post', controller.post.list)
    app.all('/api/post/:post_id', controller.post.item)

    //User
    app.all('/api/user', controller.user.list)
    app.all('/api/user/:user_id', controller.user.item)

    // Attachment [设定上传的路径. ..]
    const upload = multer({ dest: path.join(__dirname, '.', 'uploads') })
    app.all('/api/attachment', upload.single('upfile'), controller.attachment.list)
    app.all('/api/attachment/:attachment_id', controller.attachment.item)

    // Meta
    app.all('/api/meta', controller.meta)

    // Info
    app.all('/api/info', controller.info)

    // GoogleAnalytics
    app.all('/api/google', controller.google)

    // 404
    app.all('*', (req, res) => {
        res.status(404).jsonp({
            code: 0,
            message: '无效的API请求'
        })
    })

}

module.exports = routes