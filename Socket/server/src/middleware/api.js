/**
 * Created by OXOYO on 2017/10/23.
 */

import koaCompose from 'koa-compose'
import KoaRouter from 'koa-router'

// 导入配置信息
import config from '../config'
// 导入路由表
import routers from '../routers'
// 导入工具
import utils from '../utils'

const uuidv1 = require('uuid/v1')

export default function api () {
  let router = new KoaRouter({ prefix: config.api.prefix })
  Object.keys(routers).forEach(name => routers[name](router))
  // 注册中间件
  router.use(async function (ctx, next) {
    // 生成唯一的请求ID
    ctx.state.requestId = uuidv1()
    await next()
  })
  // 注册验证token中间件
  router.use(utils.auth.verifyToken)
  // 添加根路由
  router.get('/', async (ctx, next) => {
    await next()
    ctx.status = 200
    ctx.body = {}
  })

  return koaCompose([
    router.routes(),
    router.allowedMethods({
      throw: true
    })
  ])
}
