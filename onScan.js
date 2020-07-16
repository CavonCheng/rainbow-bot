const Qrterminal = require('./node_modules/qrcode-terminal')
module.exports = function onScan(qrcode, status){
    console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.github.io/qrcode/${encodeURIComponent(qrcode)}`)
    Qrterminal.generate(qrcode, {small: true})
}