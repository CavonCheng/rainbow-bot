const { Wechaty } = require('wechaty')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const { DingDong,Heartbeat  } = require('wechaty-plugin-contrib')
const { WechatyWeixinOpenAI } = require('wechaty-weixin-openai')
const openai = require('../config/openai')
const puppet = require('../config/puppet')
const onScan = require('./lib/onScan')
const { onLogin, onLogout } = require('./lib/Login')
const { onMessage } = require('./lib/Message')

module.exports = {
    start:  async () => { 
        let bot = new Wechaty({
            puppet: new PuppetPadplus({
                token: puppet.token
            }),
            name: puppet.nickName,
        })
        bot
            .on('scan', onScan)
            .on('login', user => {onLogin(bot, user)} )
            .on('message', onMessage)
            .on('logout', onLogout)
            .start()
        bot.use(DingDong({
            mention : true,    // default: true - Response to Mention Self (@/at) Message in Room
            contact : true,    // default: true - Response to Direct Message
            room    : true,    // default: true - Response to Rooms Message
            self    : true,    // default: true - Response to Message that send from the bot itself
        }))
        bot.use(Heartbeat({
            contact: 'filehelper',    // default: filehelper - Contact id who will receive the emoji
            emoji: {
              heartbeat: '[爱心]',    // default: [爱心] - Heartbeat emoji
            },
            intervalSeconds: 60 * 60, // Default: 1 hour - Send emoji for every 1 hour
        }))
        bot.use(WechatyWeixinOpenAI({
            token: openai.token,
            encodingAESKey: openai.encodingAESKey,
            mention: true,
            room: true,
            contact: true,
            // noAnswerHook: (message) => { console.log(`No Answer Message: ${message}`) }
        }))
        

    }
}

