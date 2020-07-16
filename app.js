const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const mybot = require('./bot')
const app = new Koa()

async function start(){
    app.use(bodyParser())
    const api = require('./routes/api')
    app.use(api.routes(), api.allowedMethods())
    app.listen(3000)
    console.log('已启动: http://127.0.0.1:3000');
    mybot.start()
}

start()
