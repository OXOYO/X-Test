/**
 * Created by OXOYO on 2020/5/19
 *
 *
 */

<style lang="less">
  .chat {
    width: 800px;
    margin: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
    .login {
      padding: 20px 0;
    }
    .room-box {
      width: 200px;
      border-right: 1px solid rgba(0, 0, 0, .1);
      .create-group {
        padding: 10px;
      }
      .group-list {
        display: flex;
        flex-direction: column;
        .group-item {
          padding: 10px;
          text-align: left;
          cursor: pointer;
          &:hover,
          &.active {
            background: rgba(0, 0, 0, .1);
          }
        }
      }
    }
    .window-box {
      flex: 1 1;
      display: flex;
      flex-direction: column;
      .history {
        height: 500px;
        overflow: auto;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        display: flex;
        flex-direction: column;
        .msg-item {
          display: flex;
          padding: 10px 5px;

          &.left {
            flex-direction: row;
          }
          &.right {
            flex-direction: row-reverse;
          }
          .profile {
            margin: 0 5px;
            .avatar {
              width: 40px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              font-size: 24px;
              font-weight: bolder;
              border-radius: 50%;
              background: rgba(0, 0, 0, .1);
              color: #FFFFFF;
            }
          }
          .content {
            max-width: calc(100% - 80px);
            background: rgba(244, 243, 243, 1);
            padding: 5px 10px;
            word-break: break-all;
            white-space: normal;
            text-align: left;
          }
        }
      }
      .input-box {
        .tool-bar {
          height: 30px;
        }
        .input {
          border: none;
          textarea {
            border: none;
            box-shadow: none;
            &:focus {
              border: none;
              box-shadow: none;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="chat">
    <!-- 登录 & 注册 -->
    <div class="login" v-if="!isLogined">
      <Form ref="loginForm" :model="loginForm" :rules="formRules">
        <FormItem prop="account">
          <Input type="text" v-model="loginForm.account" placeholder="请输入用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="loginForm.password" placeholder="请输入密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="doLogin()">登录</Button>
        </FormItem>
      </Form>
    </div>
    <template v-else>
      <div class="room-box">
        <div class="create-group">
          <Button
            class="btn"
            v-show="!flagMap.createGroup"
            icon="md-add"
            @click="toggleCreateGroup"
          >
            创建群
          </Button>
          <Input
            class="input"
            v-show="flagMap.createGroup"
            v-model="groupForm.name"
            placeholder="请输入群名称，回车创建群"
            @on-blur="doCreateGroup"
            @on-enter="doCreateGroup"
          />
        </div>
        <div class="group-list">
          <div
            v-for="item in groupList"
            :key="item.id"
            :class="{ 'group-item': true, active: currentChatTarget && currentChatTarget.group_id === item.group_id }"
            @click="toggleChatTarget(item, 'group')"
          >
            {{ item.group.name }}
          </div>
        </div>
      </div>
      <div class="window-box">
        <div class="history">
          <div
            v-for="(item, index) in msgList"
            :class="[ 'msg-item', item.userInfo.id === userInfo.id ? 'left' : 'right' ]"
            :key="index"
          >
            <!-- 用户信息 -->
            <div class="profile">
              <div class="avatar">{{ item.userInfo.account.slice(0, 1) }}</div>
            </div>
            <div class="content">
              <span v-if="item.contentType === 'text'">{{ item.content }}</span>
            </div>
          </div>
        </div>
        <div class="input-box">
          <div class="tool-bar"></div>
          <Input
            class="input"
            v-model="currentInput"
            type="textarea"
            :rows="4"
            :disabled="!currentChatTarget"
            placeholder="Enter something..."
            @on-keydown="sendMsg"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import io from 'socket.io-client'
  import api from '../api'
  export default {
    name: 'XChat',
    data () {
      return {
        api,
        ioPath: 'ws://localhost:3002',
        socket: null,
        // 当前输入内容
        currentInput: '',
        // 消息列表
        msgListAll: [],
        // 分页信息
        pageInfo: {
          pageSize: 100,
          currentPage: 1,
          total: 0
        },
        loginForm: {
          account: '',
          password: '',
          // 类型：0管理员 1普通用户
          type: 1,
          // 状态：0停用 1启用
          status: 1
        },
        formRules: {
          account: [
            { require: true, message: '请输入用户名' },
            { type: 'string', max: 16, min: 3, message: '请输入3到16位字符' }
          ],
          password: [
            { require: true, message: '请输入密码' },
            { type: 'string', max: 16, min: 6, message: '请输入6到16位字符' }
          ]
        },
        socketId: null,
        groupForm: {
          name: ''
        },
        // 群列表
        groupList: [],
        flagMap: {
          createGroup: false,
          chatMode: null,
          notice: false
        },
        // 当前聊天对象
        currentChatTarget: null
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      isLogined () {
        return !!this.userInfo
      },
      msgList () {
        const _t = this
        const start = (_t.pageInfo.currentPage - 1) * _t.pageInfo.pageSize
        const end = _t.pageInfo.currentPage * _t.pageInfo.pageSize
        return _t.msgListAll.slice(start, end)
      }
    },
    methods: {
      init () {
        this.initPage()
        this.checkNotice()
      },
      async initPage () {
        const _t = this
        const tokenKey = _t.$X.config.cookie.getItem('token')
        const token = _t.$X.Cookies.get(tokenKey)
        if (token) {
          // 获取用户信息
          const res = await _t.api.users.getBaseInfo()
          if (!res || res.code !== 200) {
            _t.$X.Cookies.remove(tokenKey, { path: _t.$X.config.cookie.path })
            return
          }
          const userInfo = res.data
          if (userInfo) {
            _t.$Message.success('获取用户信息成功！')
            // 更新用户信息
            _t.$store.commit('userInfo/update', userInfo)
            // 初始化聊天
            _t.initSocket()
          } else {
            _t.$X.Cookies.remove(tokenKey, { path: _t.$X.config.cookie.path })
            _t.$Message.error('获取用户信息失败！')
          }
        }
      },
      initSocket () {
        const _t = this
        _t.socket = io(_t.ioPath, {
          // path: '/chat'
        })
        // 监听socket事件
        // 监听会话初始化
        _t.socket.on('chat:init', function (data, callback) {
          console.log('chat:init', data)
          _t.socketId = data
          callback && callback(_t.userInfo)
          // 获取群列表
          _t.getGroupList()
        })
        // 监听错误消息
        _t.socket.on('chat:error', function (data, callback) {
          console.log('chat:error', data)
        })
        // 监听群消息
        _t.socket.on('group:msg', function (data, callback) {
          console.log('group:msg', data)
          _t.msgListAll.push(data)
          _t.showNotice('你有一条新消息！')
        })
      },
      // 处理消息数据结构
      handleMsg (content, contentType = 'text', type = 0) {
        return {
          time: new Date().getTime(),
          // 类型，0：当前用户client  1：服务端
          type,
          content,
          contentType
        }
      },
      sendMsg (event) {
        const _t = this
        if (event.ctrlKey && event.keyCode === 13) {
          // ctrlKey && oEvent.keyCode
          const msg = _t.currentInput
          // 清空输入框
          _t.currentInput = ''
          console.log('sendMsg', msg)
          if (msg) {
            const payload = _t.handleMsg(msg)
            // 处理聊天信息
            payload.chatTarget = _t.currentChatTarget
            payload.chatMode = _t.flagMap.chatMode
            // 处理用户信息
            payload.userInfo = _t.userInfo
            _t.msgListAll.push(payload)
            // 发送消息
            let path
            if (payload.chatMode === 'group') {
              path = 'group:msg'
            } else if (payload.chatMode === 'private') {
              path = 'private:msg'
            }
            if (path) {
              _t.socket.emit(path, payload)
            }
          }
        }
      },
      // 登录 & 注册
      async doLogin () {
        const _t = this
        // 校验
        const validResult = []
        await _t.$refs.loginForm.validate((valid) => {
          validResult.push(valid)
        })
        if (validResult.includes(false)) {
          return
        }
        const res = await _t.api.users.doLogin(_t.loginForm)
        if (!res || res.code !== 200) {
          return
        }
        const userInfo = res.data
        const token = res.data[_t.$X.config.cookie.getItem('token')]
        if (userInfo && token) {
          _t.$Message.success('登录成功！')
          // 更新用户信息
          _t.$store.commit('userInfo/update', userInfo)
          // 存储token
          _t.$X.Cookies.set(_t.$X.config.cookie.getItem('token'), token)
          // 初始化聊天
          _t.initSocket()
        } else {
          _t.$Message.error('登录失败！')
        }
      },
      // 切换创建群组
      toggleCreateGroup () {
        this.flagMap.createGroup = true
      },
      // 创建群组
      doCreateGroup () {
        const _t = this
        _t.flagMap.createGroup = false
        console.log('doCreateGroup', _t.groupForm.name)
        if (_t.groupForm.name) {
          _t.socket.emit('group:create', _t.groupForm, function (res) {
            console.log('group:create', res)
            _t.getGroupList()
          })
        }
      },
      // 获取群组列表
      getGroupList () {
        const _t = this
        // 获当前用户所属群列表
        _t.socket.emit('group:list', null, function (res) {
          console.log('group:list', res)
          _t.groupList = res.data.rows
          // 默认选中第一个群
          _t.toggleChatTarget(_t.groupList[0], 'group')
        })
      },
      // 切换聊天对象
      toggleChatTarget (item, mode) {
        const _t = this
        // 切换聊天模式
        _t.flagMap.chatMode = mode
        _t.currentChatTarget = item
        _t.currentChatTarget = item
        // 清空消息记录
        _t.msgListAll = []
        // 获取消息记录
        _t.getMsgHistory(mode)
      },
      // 检查消息通知是否支持
      checkNotice () {
        const _t = this
        // 1.先检查浏览器是否支持
        if (!('Notification' in window)) {
          console.warn('浏览器不支持消息通知！')
          // 1.判断通知权限
        } else if (Notification.permission === 'granted') {
          console.log('用户已允许通知')
          // 支持通知事件
          _t.flagMap.notice = true
        } else if (Notification.permission === 'denied') {
          console.warn('用户已拒绝通知')
        } else {
          console.warn('用户还没选择，请先申请权限')
          // 1.请求权限
          Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
              console.log('用户允许通知')
              // 支持通知事件
              _t.flagMap.notice = true
            } else if (permission === 'denied') {
              console.warn('用户拒绝通知')
            }
          })
        }
      },
      // 显示消息通知
      showNotice (msg = '你有一条新消息！') {
        const title = '通知'
        const options = {
          body: msg
        }
        const notification = new Notification(title, options)
        // 关闭
        setTimeout(function () {
          notification.close()
        }, 5000)
      },
      // 获取消息记录
      getMsgHistory (mode) {
        const _t = this
        let path
        switch (mode) {
          case 'group':
            path = 'group:history'
            break
          case 'private':
            path = 'private:history'
            break
        }
        // 广播事件
        _t.socket.emit(path, _t.pageInfo, function (data) {
          console.log('getMsgHistory', data)
          // 合并消息
          _t.msgListAll = [
            ..._t.msgListAll,
            ...data
          ]
        })
      }
    },
    created () {
      this.init()
    }
  }
</script>
