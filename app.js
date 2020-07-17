const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const koajwt = require('koa-jwt')
const logger = require('./util/logger')
const mybot = require('./bot')
const app = new Koa()

app.use(bodyParser())

async function start() {
    app.use(require('./middleware/resformat')('^/api'))
    const api = require('./routes/api')
    app.use(api.routes(), api.allowedMethods())
    app.listen(3000)
    console.log('已启动: http://127.0.0.1:3000');
    mybot.start()
}

// error
app.use(async (ctx, next) => {
    const startT = new Date()
    let ms
    try {
        await next().catch(err => {
            if (err.status === 401) {
                ctx.body = { errcode: 401, errmsg: 'Authentication' }
            } else { throw err }
        })
        ms = new Date() - startT;
    } catch (error) {
        console.log(error)
        ms = new Date() - startT
        logger.logError(ctx, error, ms)
    }
})
app.use(koajwt({ secret: require('./config').secret }).unless({
    path: [
        /^\/api\/apptoken/
    ]
}))


/**
 * init log
 */
const { baseLogPath, appenders } = require('./config/log4js')
const fs = require('fs');
const confirmPath = function (pathStr) {
    if (!fs.existsSync(pathStr)) fs.mkdirSync(pathStr)
}
const initLogPath = function () {
    if (baseLogPath) {
        confirmPath(baseLogPath)
        for (var i = 0, len = appenders.length; i < len; i++) {
            if (appenders[i].path) {
                confirmPath(baseLogPath + appenders[i].path);
            }
        }
    }
}
start()
initLogPath()