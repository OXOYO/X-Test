/**
 * Created by OXOYO on 2019/4/24.
 *
 *
 */

const crypto = require('crypto')
const des = require('./des')

const password = '123123'
const key = '12345678'
const iv = 0

const sharedSecret = crypto.randomBytes(32)
const initializationVector = crypto.randomBytes(16)
// 加密
console.log(des.encrypt('123123', password, 0))
console.log(des.encrypt(sharedSecret, password, initializationVector))
