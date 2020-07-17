const jwt = require('jsonwebtoken')
const { secret } = require('../config')


const createToken = (payload = {}, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn: expiresIn || '24h' });
}
const verifyToken = (token) => {
    return jwt.verify(token.split(' ')[1], secret);
}

module.exports = {createToken, verifyToken}