/**
 * Created by OXOYO on 2017/11/2.
 */

import log4js from 'log4js'
import config from '../config'

// 格式化响应日志
const formatRes = (ctx, ms) => {
  let tmpArr = []

  tmpArr.push('\n' + '********** RESPONSE START **********' + '\n\n')
  tmpArr.push('  request id: ' + ctx.state.requestId + '\n\n')
  tmpArr.push('  request userInfo: ' + JSON.stringify(ctx.state.userInfo) + '\n\n')
  tmpArr.push(formatReq(ctx.request, ms) + '\n')
  tmpArr.push('  response status: ' + ctx.status + '\n')
  tmpArr.push('  response body: ' + '\n  ' + JSON.stringify(ctx.body) + '\n\n')
  tmpArr.push('********** RESPONSE END **********' + '\n')

  return tmpArr.join('')
}

// 格式化错误日志
const formatError = (ctx, err, ms) => {
  let tmpArr = []

  tmpArr.push('\n' + '********** ERROR START **********' + '\n\n')
  tmpArr.push('  request id: ' + ctx.state.requestId + '\n\n')
  tmpArr.push('  request userInfo: ' + JSON.stringify(ctx.state.userInfo) + '\n\n')
  tmpArr.push(formatReq(ctx.request, ms))
  tmpArr.push('  err name: ' + err.name + '\n')
  tmpArr.push('  err message: ' + err.message + '\n')
  tmpArr.push('  err stack: ' + err.stack + '\n\n')
  tmpArr.push('********** ERROR END **********' + '\n')

  return tmpArr.join('')
}

// 格式化请求日志
const formatReq = (req, ms) => {
  let tmpArr = []

  tmpArr.push('  request method: ' + req.method + '\n')
  tmpArr.push('  request originalUrl: ' + req.originalUrl + '\n')
  tmpArr.push('  request client ip: ' + req.ip + '\n')
  if (req.method === 'GET') {
    tmpArr.push('  request query: ' + JSON.stringify(req.query) + '\n')
  } else {
    tmpArr.push('  request body: ' + '\n  ' + JSON.stringify(req.body) + '\n')
  }
  tmpArr.push('  response time: ' + ms + '\n')

  return tmpArr.join('')
}

// 处理接口排除
const handleUnless = function (ctx) {
  let originalUrl = ctx.request.originalUrl
  // 是否排除标识
  let isExclude = false
  if (!originalUrl) {
    return false
  }
  // 排除method
  if (config.log.unless.methods.includes(ctx.method.toUpperCase())) {
    return true
  }
  // 排除api
  for (let i = 0, len = config.log.unless.api.length; i < len; i++) {
    if (originalUrl.includes(config.log.unless.api[i])) {
      isExclude = true
      break
    }
  }
  return isExclude
}

// log 中间件
export default function () {
  // 加载配置文件
  log4js.configure(config.log.options)

  // error
  this.error = function (ctx, error, ms) {
    if (ctx && error) {
      log4js.getLogger('error').error(formatError(ctx, error, ms))
    }
  }
  // response
  this.response = function (ctx, ms) {
    if (ctx && !handleUnless(ctx)) {
      log4js.getLogger('result').info(formatRes(ctx, ms))
    }
  }
}
