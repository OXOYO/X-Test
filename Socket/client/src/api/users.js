/**
 * Created by OXOYO on 2020/5/21
 *
 *
 */

import Vue from 'vue'
const namespace = '/Users/'

export default {
  getList: async (data) => {
    const res = await Vue.prototype.$X.http.get(namespace + 'list', {
      params: data
    })
    return res
  },
  doLogin: async (data) => {
    const res = await Vue.prototype.$X.http.post(namespace + 'login', data)
    return res
  },
  getBaseInfo: async (data) => {
    const res = await Vue.prototype.$X.http.get(namespace + 'baseInfo', {
      params: data
    })
    return res
  },
  doAdd: async (data) => {
    const res = await Vue.prototype.$X.http.post(namespace + 'add', data)
    return res
  },
  doEdit: async (data) => {
    const res = await Vue.prototype.$X.http.post(namespace + 'edit', data)
    return res
  },
  doRemove: async (data) => {
    const res = await Vue.prototype.$X.http.post(namespace + 'remove', data)
    return res
  }
}
