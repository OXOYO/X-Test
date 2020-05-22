/**
 * Created by OXOYO on 2017/10/23.
 */

import koaCompose from 'koa-compose'
import koaConvert from 'koa-convert'
import koaHelmet from 'koa-helmet'
import koaLimit from 'koa-limit'
import koaLogger from 'koa-logger'
import koaCors from 'koa-cors'
import koaBody from 'koa-body'
// import koaStatic from 'koa-static'
import locales from 'koa-locales'

import config from '../config'
import api from './api'
import log from './log'

const path = require('path')

export default function (app) {
  const middleware = koaCompose([
    // 开发时命令行输出请求日志
    koaLogger(),
    // 注册log4js
    log(),
    // 防止洪水攻击，限制用户访问次数，一小时不超过1000次
    koaConvert(koaLimit({
      limit: 1000,
      interval: 1000 * 60 * 60
    })),
    // 安全机制
    koaHelmet(),
    // 跨域处理
    koaConvert(koaCors({
      origin: true,
      exposeHeaders: [],
      maxAge: 5,
      credentials: true,
      allowMethods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS']
      // ,
      // allowHeaders: ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Requested-With', 'Origin']
    })),
    koaBody({
      multipart: true,
      formidable: {
        // 设置上传文件大小最大限制，默认2M
        maxFileSize: 200 * 1024 * 1024
      },
      jsonLimit: '20mb',
      formLimit: '10mb',
      textLimit: '20mb'
    })
    // ,
    // koaStatic('.')
  ])
  // 注册i18n
  locales(app, {
    dirs: [path.join(__dirname, '../langs')],
    cookieField: config.cookie.getItem('locale'),
    defaultLocale: 'zh-CN'
  })
  // 注册中间件
  app.use(middleware)
  // 注册api
  app.use(api())
}
