/**
 * Created by OXOYO on 2019/4/24.
 *
 *
 */

const crypto = require('crypto')
const password = '123123'

const ecb = function () {
  let res = crypto.createCipher('ecb', password)
  console.log('ecb', res)
}

const md5 = function () {
  let instance = crypto.createHash('md5')
  let res = instance.update(password).digest('base64')
  console.log('md5', res)
}

// ecb()
md5()
