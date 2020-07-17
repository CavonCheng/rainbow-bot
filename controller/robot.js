const {upload} = require('../util/upload')
const {FileBox} = require('wechaty')
const logger = require('../util/logger')

// 上传文件
const uploadFile = async (ctx, next, formName) => {
    let err = await upload.single(formName)(ctx, next)
                    .then(res=>res)
                    .catch(err=>err)
    if(err){
        await boss.say(`发送图片失败：${err.message}`)
        throw {code: 0, message: err.message}
    }else{
        img_path = ctx.file.path
        return img_path
    }
}
// 多点发送
const multiSend = async (roomTopics, contactNames, contentObjs) => {
    try{
        // 发群消息
        if(roomTopics){
            for (let topic of roomTopics){
                let room = await bot.Room.find({topic: topic})
                if(!room){
                    console.log(`未发现群：${topic}`);
                    logger.error({errmsg: `未发现消息接收群：${topic}`})
                    continue
                }
                for (let content of contentObjs){
                    await room.say(content)
                }
            }
        }
        // 发个人消息
        if(contactNames){
            for (let name of contactNames){
                let contact = await bot.Contact.find(name)
                if(!contact){
                    console.log(`未发联系人：${name}`);
                    logger.error({errmsg: `未发现消息接收联系人：${name}`})
                    continue
                }
                for (let content of contentObjs){
                    await contact.say(content)
                }
            }
        }
    } catch (err) { throw err }
}

module.exports = {
    // todo: 多文件上传、发送，删除文件
    sendImage: async (ctx, next) => {
        try {
            const img_path = await uploadFile(ctx, next, 'image_box')
            const fileBox = FileBox.fromFile(img_path)
            // 坑 注意顺序，上传文件后才能获取到body数据
            const roomTopics = ctx.request.body.roomTopics
            const contactNames = ctx.request.body.contactNames
    
            await multiSend(roomTopics, contactNames, [fileBox])
            ctx.body = {}
        } catch (err) { throw err }
    },
    sendText: async (ctx) => {
        try {
            const roomTopics = ctx.request.body.roomTopics
            const contactNames = ctx.request.body.contactNames
            const contents = ctx.request.body.contents
            console.log(`roomTopics:${roomTopics}, contactNames:${contactNames}`);
            await multiSend(roomTopics, contactNames, contents)
            ctx.body = {}
        } catch (err) { throw err }
    },

}