const {upload} = require('../util/upload')
const {FileBox} = require('wechaty')

module.exports = {
    sendPic: async (ctx,next)=>{
        let err = await upload.single('file_input')(ctx, next)
                    .then(res=>res)
                    .catch(err=>err)
        if(err){
            ctx.body = {
                code: 0,
                msg : err.message
            }
            await boss.say(`发送图片失败：${err.message}`)
        }else{
            img_path = ctx.file.path
            const fileBox = FileBox.fromFile(img_path)
            // 发送到微信
            // const contact = await bot.Contact.find({ name: '橙子哥' })
            // await contact.say(fileBox) 

            const room = await bot.Room.find({topic: '测试'})
            await room.say(fileBox)
            let members = await room.memberAll('大boss')
            await room.say('牛逼，你成功了！', ...members)
            
            await boss.say(fileBox)
            ctx.body = {
                code:200,
                data:ctx.file
            }
        }
    },
    friendSay: async (ctx) => {
        try {
            const contact = await bot.Contact.find({ id: ctx.request.body.id })
            await contact.say(ctx.request.body.content)
            ctx.body = {}
        } catch (err) { throw err }
    },
    roomSay: async (ctx) => {
        try {
            const room = await bot.Room.find({ id: ctx.request.body.id })
            await room.say(ctx.request.body.content)
            ctx.body = {}
        } catch (err) { throw err }
    },
    getRoom: async (ctx) => {
        try {
            const room = await bot.Room.find({ id: ctx.params.id })
            const topic = await room.topic()
            const announce = await room.announce()
            ctx.body = { topic, announce }
        } catch (err) { throw err }
    },
    updateRoom: async (ctx) => {
        try {
            const room = await bot.Room.find({ id: ctx.params.id })
            if (ctx.request.body.topic) {
                await room.topic(ctx.request.body.topic)
                await Group.updateOne({ id: ctx.params.id }, { topic: ctx.request.body.topic })
            }
            if (ctx.request.body.announce) {
                await room.announce(ctx.request.body.announce)
            }
            ctx.body = {}
        } catch (err) { throw { message: '没有权限，不是群主或者管理员' } }
    },
    roomQuit: async (ctx) => {
        try {
            const room = await bot.Room.find({ id: ctx.request.body.id })
            await room.quit()
            ctx.body = {}
        } catch (err) { throw err }
    },



}