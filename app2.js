const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const multer = require('@koa/multer')
const path = require('path')

const {Wechaty} = require('wechaty')
const { FileBox } =require('file-box') 
const onScan = require('./bot/lib/onScan')


// --------- bot ------------ //
// const bot = new Wechaty()
// bot
// .on('scan', onScan)
// .on('login', user => console.log(`User ${user} logined`))
// .on('message', message => console.log(`Message: ${message}`))
// .start()

// --------- bot end ------------ //


const app = new Koa()
const router = new Router()

router.get('/', (ctx) => {
    ctx.body = `
        <form action="/sign" method="post">
            <p> name: <input name="name" /></p>
            <p> password: <input name="password" /></p>
            <p> <input type="submit" value="submit" /></p>
        </form>
        `
})
router.post('/sign', (ctx)=>{
    let name = ctx.request.body.name || ''
    let password = ctx.request.body.password || ''
    console.log(`name: ${name}, password: ${password}`)

    if(name=='koa' && password=='123'){
        ctx.body = `welcome ${name}!`
    }else{
        ctx.body = `<p>login failed!</p>
            <p><a href="/">try again</a></p>
        `
    }
})

// ----- 文件上传 ------ //

var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname ,'/public/uploads'))
    },
    //修改文件名称
    filename: function (req, file, cb) {
        let sufix = file.originalname.split('.')[1]
        cb(null, `${Date.now().toString(16)}.${sufix}`)
    }
})
//加载配置
var upload = multer({ storage: storage });

router.post('/upload', async (ctx,next)=>{

    let err = await upload.single('file_input')(ctx, next)
                .then(res=>res)
                .catch(err=>err)
    
    console.log(ctx.file);
    if(err){
        ctx.body = {
            code: 0,
            msg : err.message
        }
    }else{
        img_path = ctx.file.path
        console.log(ctx.request.body.filename);
        console.log(img_path);
        
        // const contact  = await bot.Contact.find({ name: '橙子哥' })
        // const fileBox = FileBox.fromFile(img_path)
        // const fileBox1 = FileBox.fromUrl('https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=25294668,1444134064&fm=26&gp=0.jpg')
        // await contact.say('Hello wechaty!')
        // await contact.say(fileBox)
        // await contact.say(fileBox1)
        ctx.body = {
            code:200,
            data:ctx.file
        }
    }

})

router.get('/up', (ctx) => {
    ctx.body = `
        <form action="/upload" method="post"  enctype="multipart/form-data">
            <p> filename: <input type="text" name="filename" /></p>
            <p> file: <input type="file" name="file_input" /></p>
            <p> <input type="submit" value="submit" /></p>
        </form>
        `
})

// ----- 文件上传 end ------ //

app.use(bodyParser())
app.use(router.routes(), router.allowedMethods())
app.listen(3000)
console.log('已启动');

