import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null
  },
  mutations: {
    'userInfo/update': (state, data) => {
      state.userInfo = data
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    userInfo: state => state.userInfo
  }
})
