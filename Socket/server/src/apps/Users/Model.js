/**
 * Created by OXOYO on 2017/10/27.
 */

import db from '../../db'

const usersSchema = db.import('../../schema/users')

export default {
  // 系统登录
  doSignIn: async function (data) {
    let res = await usersSchema.findOne({
      where: {
        account: data.account,
        password: data.password
      },
      logging: true
    })
    return res
  },
  // 获取用户基本信息
  getBaseInfo: async function (userId) {
    let res = await usersSchema.findOne({
      attributes: [ 'id', 'account', 'type', 'status', 'socket_id', 'create_time', 'update_time' ],
      where: {
        id: userId
      },
      logging: true
    })
    return res
  },
  // 添加账号
  doAddUser: async function (data) {
    let res = await usersSchema.findOrCreate({
      where: {
        account: data.account
      },
      defaults: data,
      logging: true
    })
    return res
  },
  doRemoveUser: async function (data) {
    // 删除账号
    let res = await usersSchema.destroy({
      where: {
        id: Object.values(data)
      },
      logging: true
    })
    return res
  },
  // 更新账号
  doEditUser: async function (data) {
    let res = await usersSchema.update(data, {
      where: {
        id: data.id
      },
      logging: true
    })
    return res
  }
}
