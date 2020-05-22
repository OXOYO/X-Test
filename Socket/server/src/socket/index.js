/**
 * Created by OXOYO on 2020/5/21
 *
 * socket处理逻辑
 */

import groupModel from './Groups/Model'
const uuidv1 = require('uuid/v1')

export default function (app) {
  // 创建服务
  const server = require('http').Server(app.callback())
  const io = require('socket.io')(server)
  // 处理CORS
  io.origins(['http://localhost:8080'])
  // 监听链接建立
  io.on('connection', socket => {
    const socketId = socket.id
    console.log('socket start...', socket.id)
    let userId
    // 初始化会话
    socket.emit('chat:init', socketId, async function (data) {
      // console.log('userInfo', data)
      userId = data.id
      console.log('userId', userId)
      // 查找房间，加入会话
      let res = await groupModel.getAllGroupList({
        userId
      })
      if (res && res.count && Array.isArray(res.rows)) {
        res.rows.forEach(item => {
          console.log('item.group.room_id', item.group.room_id)
          // 加入群组会话
          socket.join(item.group.room_id)
        })
      }
    })
    // 获取聊天记录并发送到client
    // 建群
    socket.on('group:create', async function (data, callback) {
      try {
        console.log('group:create', data)
        let res
        if (data.name) {
          res = await groupModel.doAddGroup({
            name: data.name,
            room_id: uuidv1(),
            create_user_id: userId,
            create_time: new Date()
          })
          // 最后一项为插入成功与否标识
          let [resAccount] = res
          let isSuccess = res.pop()
          const groupId = resAccount.id
          const roomId = resAccount.room_id
          // 处理结果
          if (isSuccess) {
            // 加入群组
            await groupModel.joinGroup({
              user_id: userId,
              group_id: groupId
            })
            // 加入群组会话
            socket.join(roomId)
            res = {
              code: 200,
              msg: '创建成功！',
              data: resAccount
            }
          } else if (resAccount) {
            // 加入群组会话
            socket.join(roomId)
            res = {
              code: 5000,
              msg: '创建失败，同名群组已存在！',
              data: resAccount
            }
          } else {
            res = {
              code: 5000,
              msg: '创建失败！',
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
        callback && callback(res)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:create',
          message: err.message
        })
      }
    })
    // 进群
    socket.on('group:enter', function (data, callback) {
      try {
        console.log('group:enter', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:enter',
          message: err.message
        })
      }
    })
    // 退群
    socket.on('group:leave', function (data, callback) {
      try {
        console.log('group:leave', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:leave',
          message: err.message
        })
      }
    })
    // 群信息
    socket.on('group:info', function (data, callback) {
      try {
        console.log('group:info', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:info',
          message: err.message
        })
      }
    })
    // 更新群信息
    socket.on('group:update', function (data, callback) {
      try {
        console.log('group:update', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:update',
          message: err.message
        })
      }
    })
    // 群消息记录
    socket.on('group:history', async function (data, callback) {
      try {
        console.log('group:history', data)
        let res = await groupModel.getHistory(data)
        if (res && res.count && Array.isArray(res.rows)) {
          let list = []
          res.rows.forEach(item => {
            list.push({
              id: item.id,
              content: item.content,
              contentType: item.content_type,
              userInfo: item.userInfo,
              group_id: item.group_id,
              user_id: item.user_id
            })
          })
          callback && callback(list)
        }
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:history',
          message: err.message
        })
      }
    })
    // 获取群成员
    socket.on('group:members', function (data, callback) {
      try {
        console.log('group:members', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:members',
          message: err.message
        })
      }
    })
    // 群消息
    socket.on('group:msg', async function (data, callback) {
      try {
        console.log('group:msg', data)
        // TODO 存储消息记录
        await groupModel.saveMsg({
          user_id: data.userInfo.id,
          group_id: data.chatTarget.group_id,
          content: data.content,
          content_type: data.contentType,
          create_time: new Date(data.time)
        })
        const groupInfo = data.chatTarget
        socket.broadcast.to(groupInfo.group.room_id).emit('group:msg', data)
        callback && callback(data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:msg',
          message: err.message
        })
      }
    })
    // 群搜索
    socket.on('group:search', function (data, callback) {
      try {
        console.log('group:search', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:search',
          message: err.message
        })
      }
    })
    // 当前用户所属群列表
    socket.on('group:list', async function (data, callback) {
      try {
        console.log('group:list', data)
        let res = await groupModel.getAllGroupList({
          userId
        })
        res = {
          code: 200,
          msg: '获取群列表！',
          data: res
        }
        callback && callback(res)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:list',
          message: err.message
        })
      }
    })
    // 添加成员
    socket.on('group:add', function (data, callback) {
      try {
        console.log('group:add', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:add',
          message: err.message
        })
      }
    })
    // 删除成员
    socket.on('group:remove', function (data, callback) {
      try {
        console.log('group:remove', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:remove',
          message: err.message
        })
      }
    })
    // 上传
    socket.on('group:upload', function (data, callback) {
      try {
        console.log('group:upload', data)
      } catch (err) {
        io.to(socketId).emit('chat:error', {
          code: 1000,
          name: 'group:upload',
          message: err.message
        })
      }
    })
  })
  return server
}
