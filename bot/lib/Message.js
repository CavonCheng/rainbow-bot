/*
 * @Desc: 消息监听
 *
 */
const { Message } = require('wechaty')

async function onMessage(msg) {
    reg = /^#.*/
    if(reg.test(msg.text())){
        console.log(`Message: ${msg}`)
    }
    
}

module.exports = {onMessage}