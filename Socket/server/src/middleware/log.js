/**
 * Created by OXOYO on 2019/4/3.
 *
 * log中间件
 */

import utils from '../utils'
// 实例化log
const logInstance = new utils.Log()

// 日志中间件
export default function () {
  return async function (ctx, next) {
    let startTime = new Date()
    let ms
    try {
      await next()
      ms = new Date() - startTime
      logInstance.response(ctx, ms)
    } catch (err) {
      ms = new Date() - startTime
      logInstance.error(ctx, err, ms)
    }
  }
}
