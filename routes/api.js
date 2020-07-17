const robotCtrl = require('../controller/robot')
const sysCtrl = require('../controller/sys')
const router = require('koa-router')()
const botLogin = require('../middleware/botLogin')
router.prefix('/api')


router.post('/robot/sendimage',  botLogin(), robotCtrl.sendImage)
router.post('/robot/sendtext',  botLogin(), robotCtrl.sendText)

router.post('/apptoken', sysCtrl.apptoken)
router.get('/checktoken', sysCtrl.checktoken)

// 以下为测试
router.get('/', sysCtrl.index)
router.get('/up', sysCtrl.up)
router.post('/upload', sysCtrl.upload)
router.post('/sign', sysCtrl.sign)

module.exports = router