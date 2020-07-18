const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const fs = require('fs')


const createToken = (payload = {}, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn: expiresIn || '24h' });
}
const verifyToken = (token) => {
    return jwt.verify(token.split(' ')[1], secret);
}

// 删除文件
const delFiles = async (paths) => {
    try{
        if(!(paths && paths.length > 0) ) return
        for (p of paths){
            if(fs.existsSync(p)){
                fs.unlinkSync(p)
            }
        }
    } catch(err) { throw err }
}

module.exports = {createToken, verifyToken, delFiles}