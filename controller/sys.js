const {upload} = require('../util/upload')
const {user} = require('../config')
const {createToken} = require('../util')


// 上传文件
const uploadFiles = async (ctx, next, formName) => {
  let err = await upload.array(formName)(ctx, next)
                  .then(res=>res)
                  .catch(err=>err)
  if(err){
      await boss.say(`上传文件失败：${err.message}`)
      throw {code: 0, message: err.message}
  }else{
      console.log(ctx.files);
  }
}

module.exports = {
  index: async (ctx) => {
    try {
      ctx.body = `
      <form action="/api/sign" method="post">
          <p> name: <input name="name" /></p>
          <p> password: <input name="password" /></p>
          <p> <input type="submit" value="submit" /></p>
      </form>
      `
    } catch (err) { throw err }
  },

  sign: async (ctx) => {
    let name = ctx.request.body.name || ''
    let password = ctx.request.body.password || ''
    console.log(`name: ${name}, password: ${password}`)

    if(name=='koa' && password=='123'){
        ctx.body = `welcome ${name}!`
    }else{
        ctx.body = `<p>login failed!</p>
            <p><a href="/api/">try again</a></p>
        `
    }
  },

  up: async (ctx) => {
    ctx.body = `
        <form action="/upload" method="post"  enctype="multipart/form-data">
            <p> filename: <input type="text" name="filename" /></p>
            <p> file: <input type="file" name="file_input" /></p>
            <p> <input type="submit" value="submit" /></p>
        </form>
        `
  },

  upload: async (ctx,next)=>{
    await uploadFiles(ctx, next, 'image_box')
  },
  // ------------------上面是测试代码---------------------------------------------- // 
  apptoken: async (ctx) => {
    let params = ctx.request.body
    if(user.username === params.username && user.password === params.password){
      ctx.body = { token: createToken({ id: user.id }) }
    } else { 
      throw { code: 0, messaage: '获取token失败' }
    }
  },
  checktoken: async (ctx) => {
    try {
      ctx.body = {}
    } catch (err) { throw err }
  }


}
