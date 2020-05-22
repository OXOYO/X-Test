/**
 * Created by OXOYO on 2017/10/23.
 */

import jsonwebtoken from 'jsonwebtoken'
import config from '../config'

export default {
  // 生成token
  sign: function (data) {
    let token = jsonwebtoken.sign(data, config.cookie.getItem('secret'), {
      algorithm: 'HS256',
      expiresIn: '1d'
    })
    return token
  },
  // token 验证
  verifyToken: async function (ctx, next) {
    let currentPath = ctx.path.slice(config.api.prefix.length)
    let unlessAPI = config.auth.unless.verifyToken.api
    if (!unlessAPI.length || unlessAPI.includes(currentPath)) {
      await next()
    } else {
      // 支持多种方式传递token
      let key = config.cookie.getItem('token')
      let token
      let decoded
      // 校验结果
      let verifyRes = {
        // 标识
        flag: false,
        // 数据
        data: {}
      }
      if (ctx.body && Object.prototype.hasOwnProperty.call(ctx.body, key)) {
        token = ctx.body[key]
      } else if (ctx.query && Object.prototype.hasOwnProperty.call(ctx.query, key)) {
        token = ctx.query[key]
      } else if (ctx.headers && Object.prototype.hasOwnProperty.call(ctx.headers, key)) {
        token = ctx.headers[key]
      } else {
        token = null
      }
      // 1.判断是否存在token
      if (token) {
        try {
          // 2.1.verify验证token
          decoded = jsonwebtoken.verify(token, config.cookie.getItem('secret'), { algorithm: 'HS256' })
          // 2.1.验证token是否过期
          if (decoded.exp * 1000 <= new Date()) {
            verifyRes = {
              flag: false,
              data: {
                code: 9999,
                msg: 'token过期！请重新登录！',
                data: {}
              }
            }
          } else {
            verifyRes = {
              flag: true,
              data: {}
            }
          }
        } catch (err) {
          verifyRes = {
            flag: false,
            data: {
              code: 9999,
              msg: 'token校验失败！请重新登录！',
              data: err
            }
          }
        }
      } else {
        verifyRes = {
          flag: false,
          data: {
            code: 9999,
            msg: 'token无效！请重新登录！',
            data: {}
          }
        }
      }
      console.log('verifyRes', verifyRes, decoded)
      // 判断校验结果，分别处理
      if (verifyRes.flag) {
        // token有效，传递给上下文
        ctx.state['userInfo'] = decoded
        await next()
      } else {
        // token无效，直接返回
        ctx.body = verifyRes.data
      }
    }
  }
}
