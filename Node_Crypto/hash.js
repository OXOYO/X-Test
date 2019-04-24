/*
*
* 打印不同hash算法的输出结果
*
* */

const crypto = require('crypto')
const fs = require('fs')

function hashAlgorithm(algorithm, str){
  let t1 = new Date()
  // 创建hash对象
  let instance = crypto.createHash(algorithm)

  let filename = 'test.txt'
  let stream = fs.ReadStream(filename)

  stream.on('data', function(val) {
    instance.update(val)
  })
  stream.on('end', function() {
    let res = instance.digest('hex')
    let t2 = new Date()
    console.log(t2 - t1 + 'ms', algorithm, res)
  })
}

function doHash(hashs){
  hashs.forEach(function(name){
    hashAlgorithm(name)
  })
}

doHash(crypto.getHashes())
