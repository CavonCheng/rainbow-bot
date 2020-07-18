const { upload } = require('../util/upload')
const { FileBox } = require('wechaty')
const { delFiles } = require('../util')
const logger = require('../util/logger')

// 抽取已上传文件存储路径
const extractPaths = async (files) => {
    let paths = []
    for (f of files){
        paths.push(f.path)
    }
    return paths
}
// 创建[多个]wechaty fileBox
const buildFileBoxes = async (paths) => {
    let boxes = []
    for (p of paths){
        let fileBox = FileBox.fromFile(p)
        boxes.push(fileBox)
    }
    return boxes
}

// 上传文件
const uploadFiles = async (ctx, next, feildName) => {
    let err = await upload.array(feildName)(ctx, next)
                    .then(res=>res)
                    .catch(err=>err)
    if(err){
        await boss.say(`上传文件失败：${err.message}`)
        throw {code: 0, message: err.message}
    }else{
        logger.info('上传文件成功')
        paths = await extractPaths(ctx.files)
        return paths
    }
}
// 多点多条发送
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
        return true
    } catch (err) { throw err }
}

const robot = {
    // 发送[多]文件消息
    sendFile: async (ctx, next) => {
        try {
            const paths = await uploadFiles(ctx, next, 'file_box') // 前端请求字段名必须是file_box
            // 坑 注意顺序，上传文件后才能获取到body数据
            const roomTopics = ctx.request.body.roomTopics
            const contactNames = ctx.request.body.contactNames
            const fileBoxes = await buildFileBoxes(paths)
    
            const sended = await multiSend(roomTopics, contactNames, fileBoxes)
            // 删除服务端存储文件
            await delFiles(paths)

            ctx.body = {}
        } catch (err) { throw err }
    },
    // 发送[多]文本消息
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
    // 发送文本文件混合消息
    sendMix: async (ctx, next) => {
        await robot.sendFile(ctx, next)
        await robot.sendText(ctx)
    }

}


module.exports = robot