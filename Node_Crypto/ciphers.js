/*
*
* 打印不同加密算法的输出结果
*
* */

const crypto = require('crypto')
const fs = require('fs')

// 加密
const cipher = function (algorithm, key, buf, cb) {
  let encrypted = ''
  let cip = crypto.createCipher(algorithm, key)
  encrypted += cip.update(buf, 'binary', 'hex')
  encrypted += cip.final('hex')
  cb(encrypted)
}

// 解密
const decipher = function (algorithm, key, encrypted, cb) {
  let decrypted = ''
  let decipher = crypto.createDecipher(algorithm, key)
  decrypted += decipher.update(encrypted, 'hex', 'binary')
  decrypted += decipher.final('binary')
  cb(decrypted)
}

// 加密文件
const cipherDecipherFile = function (filename, algorithm, key){
  fs.readFile(filename, 'utf-8', function (err, data) {
    if (err) {
      throw err
    }
    let t1 = new Date()

    cipher(algorithm, key,data,function(encrypted){
      let t2 = new Date()
      console.log('cipher  ', t2 - t1 + 'ms', algorithm, encrypted)

      decipher(algorithm, key, encrypted,function(txt){
        let t3 = new Date()
        console.log('decipher', t3 - t2 + 'ms', algorithm, txt)
      })
    })
  })
}

let key = 'abc'
let filename = 'test.txt'
// let algs = crypto.getCiphers()
let algs = ['blowfish', 'aes-256-cbc', 'cast', 'des', 'des3', 'idea', 'rc2', 'rc4', 'seed']
algs.forEach(function(name){
  cipherDecipherFile(filename, name, key)
})
