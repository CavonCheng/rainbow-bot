/*
 * @Desc: 消息监听
 *
 */
const { Message } = require('wechaty')

async function onMessage(msg) {
    console.log(`Message: ${msg}`)
}

module.exports = {onMessage}