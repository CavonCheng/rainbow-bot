const robotCtrl = require('../controller/robot')
const sysCtrl = require('../controller/sys')
const router = require('koa-router')()
const botLogin = require('../middleware/botLogin')


// router.post('/robot/sendtext', botLogin(), robotCtrl.sendText)
router.post('/robot/sendpic',  robotCtrl.sendPic)

router.get('/', sysCtrl.index)
router.get('/up', sysCtrl.up)
router.post('/upload', sysCtrl.upload)
router.post('/sign', sysCtrl.sign)

module.exports = router