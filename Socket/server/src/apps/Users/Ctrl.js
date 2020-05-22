/**
 * Created by OXOYO on 2017/10/27.
 */

import Model from './Model'
import utils from '../../utils'
import config from '../../config'

export default {
  // 获取账号列表
  getUserList: async (ctx, next) => {
    await next()
    let reqQuery = ctx.query
    let userInfo = ctx.state.userInfo
    // 查询结果
    let res = await Model.getUserList(reqQuery, userInfo)
    // 处理结果
    if (res) {
      // 密码解码
      for (let i = 0, len = res.rows.length; i < len; i++) {
        res.rows[i].password = utils.des.decrypt(config.system.secret, res.rows[i].password, 0)
      }
      res = {
        code: 200,
        msg: ctx.__('L0005001'),
        data: {
          count: res.count,
          list: res.rows
        }
      }
    } else {
      res = {
        code: 5000,
        msg: ctx.__('L0005002'),
        data: {}
      }
    }

    ctx.body = res
  },
  // 登录
  doLogin: async (ctx, next) => {
    await next()
    // 查询结果
    let reqBody = ctx.request.body
    let timeNow = new Date()
    let data = {
      ...reqBody,
      password: utils.des.encrypt(config.system.secret, reqBody.password, 0),
      create_time: timeNow,
      update_time: timeNow
    }
    let res
    if (data.account) {
      res = await Model.doAddUser(data)
      // 最后一项为插入成功与否标识
      let [resAccount] = res
      // 处理结果
      if (resAccount) {
        // 生成token
        let userInfo = {
          account: resAccount.account,
          userId: resAccount.id,
          type: resAccount.type
        }
        let token = utils.auth.sign(userInfo)
        if (token) {
          data = {
            id: resAccount.id,
            account: resAccount.account,
            type: resAccount.type,
            status: resAccount.status,
            socket_id: resAccount.socket_id,
            create_time: resAccount.create_time,
            update_time: resAccount.update_time
          }
          // 设置返回token
          data[config.cookie.getItem('token')] = token
          res = {
            code: 200,
            msg: '登录成功！',
            data: data
          }
        } else {
          res = {
            code: 5000,
            msg: '登录失败！',
            data: {}
          }
        }
      } else {
        res = {
          code: 5000,
          msg: '登录失败！',
          data: {}
        }
      }
    } else {
      res = {
        code: 5001,
        msg: '上送参数有误！',
        data: {}
      }
    }

    ctx.body = res
  },
  // 获取用户基本信息
  getBaseInfo: async (ctx, next) => {
    await next()
    let userInfo = ctx.state.userInfo
    console.log('userInfo', userInfo)
    let res
    if (userInfo && userInfo.userId) {
      // 查询结果
      res = await Model.getBaseInfo(userInfo.userId)
      // 处理结果
      if (res) {
        res = {
          code: 200,
          msg: '获取用户信息成功！',
          data: res
        }
      } else {
        res = {
          code: 5000,
          msg: '获取用户信息失败！',
          data: res
        }
      }
    } else {
      res = {
        code: 5001,
        msg: '上送参数有误！',
        data: {}
      }
    }
    ctx.body = res
  },
  // 添加账号
  doAddUser: async (ctx, next) => {
    await next()
    // 查询结果
    let reqBody = ctx.request.body
    let timeNow = new Date()
    let data = {
      ...reqBody,
      password: utils.des.encrypt(config.system.secret, reqBody.password, 0),
      create_time: timeNow,
      update_time: timeNow
    }
    let res
    if (data.account && data.name) {
      res = await Model.doAddUser(data)
      // 最后一项为插入成功与否标识
      let [resAccount] = res
      let isSuccess = res.pop()
      // 处理结果
      if (isSuccess) {
        res = {
          code: 200,
          msg: ctx.__('L0005003'),
          data: resAccount
        }
      } else if (resAccount) {
        res = {
          code: 5000,
          msg: ctx.__('L0005004'),
          data: resAccount
        }
      } else {
        res = {
          code: 5000,
          msg: ctx.__('L0005005'),
          data: {}
        }
      }
    } else {
      res = {
        code: 5001,
        msg: ctx.__('L0005006'),
        data: {}
      }
    }

    ctx.body = res
  },
  // 删除账号
  doRemoveUser: async (ctx, next) => {
    await next()
    let reqBody = ctx.request.body
    let data = reqBody
    let res
    if ((Object.keys(data)).length) {
      res = await Model.doRemoveUser(data)
      // 处理结果
      if (res) {
        res = {
          code: 200,
          msg: ctx.__('L0005007'),
          data: res
        }
      } else {
        res = {
          code: 5000,
          msg: ctx.__('L0005008'),
          data: {}
        }
      }
    } else {
      res = {
        code: 5001,
        msg: ctx.__('L0005009'),
        data: {}
      }
    }

    ctx.body = res
  },
  // 编辑账号
  doEditUser: async (ctx, next) => {
    await next()
    let reqBody = ctx.request.body
    let timeNow = new Date()
    let data = {
      ...reqBody,
      password: utils.des.encrypt(config.system.secret, reqBody.password, 0),
      update_time: timeNow
    }
    let res
    if (data.id) {
      res = await Model.doEditUser(data)
      // 处理结果
      if (res && res[0]) {
        res = {
          code: 200,
          msg: ctx.__('L0005010'),
          data: res
        }
      } else {
        res = {
          code: 5000,
          msg: ctx.__('L0005011'),
          data: res
        }
      }
    } else {
      res = {
        code: 5001,
        msg: ctx.__('L0005012'),
        data: {}
      }
    }

    ctx.body = res
  }
}
