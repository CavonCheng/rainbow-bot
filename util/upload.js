const multer = require('@koa/multer')
const path = require('path')

// 文件上传相关
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname ,'../public/uploads'))
    },
    filename: function (req, file, cb) {
        let sufix = file.originalname.split('.')[1]
        cb(null, `${Date.now().toString(16)}.${sufix}`)
    }
})
var upload = multer({ storage: storage });

module.exports = {upload}