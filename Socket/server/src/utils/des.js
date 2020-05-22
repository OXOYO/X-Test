/**
 * Created by OXOYO on 2017/11/21.
 *
 * des 加密
 */

const crypto = require('crypto')

export default {
  algorithm: {
    ecb: 'des-ecb',
    cbc: 'des-cbc'
  },
  encrypt: function (key, plaintext, iv) {
    key = Buffer.from(key)
    iv = Buffer.alloc(iv)
    let cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv)
    // default true
    cipher.setAutoPadding(true)
    let ciph = cipher.update(plaintext, 'utf8', 'base64')
    ciph += cipher.final('base64')
    return ciph
  },
  decrypt: function (key, encryptText, iv) {
    key = Buffer.from(key)
    iv = Buffer.alloc(iv)
    let decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv)
    decipher.setAutoPadding(true)
    let txt = decipher.update(encryptText, 'base64', 'utf8')
    txt += decipher.final('utf8')
    return txt
  }
}
