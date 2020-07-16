
/**
 * 登录
 * @param {object} bot 
 * @param {object} user 
 */
const onLogin = async(bot, user) => {
    const boss = await bot.Contact.find({alias: '大boss'})
    await bot.say('我登录了')

    console.log(`boss: ${boss.name()}`);
    console.log(`robot: ${user} logined`)

    global.bot = bot
    global.boss = boss
}

/**
 * 退出
 * @param {String} user 
 */
async function onLogout(user) {
    await bot.say('我退出了')
    delete global.bot
    console.log(`robot: ${user} 退出`)
}

module.exports ={onLogin,onLogout}