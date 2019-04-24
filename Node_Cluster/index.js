/**
 * Created by OXOYO on 2019/4/16.
 *
 *
 */

const cluster = require('cluster')
const os = require('os')

// 打印机器cpu信息
let cpus = os.cpus()
for (let item of cpus) {
  console.log(JSON.stringify(item))
}

console.log('isMaster', cluster.isMaster)

const buf1 = Buffer.alloc(10, 1)
console.log('buf', buf1, buf1.length)
