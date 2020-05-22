/**
 * Created by OXOYO on 2017/10/27.
 */

import db from '../../db'

const groupsSchema = db.import('../../schema/groups')
const usersGroupRelationSchema = db.import('../../schema/user_group_relation')
const msgGroupSchema = db.import('../../schema/msg_group')
const usersSchema = db.import('../../schema/users')
// users 与 groups 关联关系中查找group信息
const userGroupRelation = usersGroupRelationSchema.belongsTo(groupsSchema, {
  foreignKey: 'group_id',
  targetKey: 'id',
  as: 'group'
})
// 群组消息记录中查找user信息
const userGroupMsgRelation = msgGroupSchema.belongsTo(usersSchema, {
  foreignKey: 'user_id',
  targetKey: 'id',
  as: 'userInfo'
})

export default {
  getAllGroupList: async (data) => {
    let options = {}
    // 拼装where条件
    let whereObj = {}
    console.log('data', data)
    // 过滤用户
    if (data.userId) {
      whereObj['user_id'] = data.userId
    }
    // 处理options
    if ((Object.keys(whereObj)).length) {
      options['where'] = whereObj
    }
    // 处理排序
    options['order'] = [
      ['id', 'ASC']
    ]
    // 关联关系
    options['include'] = [
      {
        association: userGroupRelation,
        attributes: ['id', 'room_id', 'name', 'create_user_id', 'create_time']
      }
    ]
    // 当存在1:N关联关系时用findAndCountAll查询需使用distinct参数去重
    options['distinct'] = true
    // 打印日志
    options['logging'] = true
    let res = await usersGroupRelationSchema.findAndCountAll(options)
    return res
  },
  // 添加群
  doAddGroup: async function (data) {
    let res = await groupsSchema.findOrCreate({
      where: {
        name: data.name
      },
      defaults: data,
      logging: true
    })
    return res
  },
  doRemoveGroup: async function (data) {
    let res = await groupsSchema.destroy({
      where: {
        id: Object.values(data)
      },
      logging: true
    })
    return res
  },
  // 更新群
  doEditGroup: async function (data) {
    let res = await groupsSchema.update(data, {
      where: {
        id: data.id
      },
      logging: true
    })
    return res
  },
  // 加入群组
  joinGroup: async (data) => {
    let res = await usersGroupRelationSchema.findOrCreate({
      where: {
        user_id: data.user_id,
        group_id: data.group_id
      },
      defaults: data,
      logging: true
    })
    return res
  },
  // 获取消息记录
  getHistory: async (data) => {
    let options = {}
    // 处理分页
    let pageSize = data.pageSize || 10
    let currentPage = data.currentPage || 1
    options['limit'] = parseInt(pageSize)
    options['offset'] = parseInt((currentPage - 1) * pageSize)
    // 拼装where条件
    let whereObj = {}
    // 群组
    if (data && data.group_id) {
      whereObj['data'] = data.group_id
    }
    // 处理options
    if ((Object.keys(whereObj)).length) {
      options['where'] = whereObj
    }
    // 处理排序
    options['order'] = [
      ['id', 'ASC']
    ]
    // 关联关系
    options['include'] = [
      // 关联用户
      {
        association: userGroupMsgRelation,
        attributes: [ 'id', 'account', 'type', 'status', 'socket_id', 'create_time', 'update_time' ]
      }
    ]
    // 当存在1:N关联关系时用findAndCountAll查询需使用distinct参数去重
    options['distinct'] = true
    // 打印日志
    options['logging'] = true
    let res = await msgGroupSchema.findAndCountAll(options)
    return res
  },
  // 保存消息
  saveMsg: async (data) => {
    let res = await msgGroupSchema.create(data, {
      logging: true
    })
    return res
  }
}
