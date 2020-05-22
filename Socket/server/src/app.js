/**
 * Created by OXOYO on 2017/10/23.
 */

import Koa from 'koa'
import qs from 'koa-qs'
import middleware from './middleware'
import socket from './socket'

// 实例化app
const app = new Koa()

// 开启代理
app.proxy = true
// 注册qs
qs(app)
// 注册中间件
middleware(app)
// 注册socket逻辑
const server = socket(app)

// 监听error
server.on('error', function (err, ctx) {
  console.log('Service error', err)
})

exports = module.exports = server
