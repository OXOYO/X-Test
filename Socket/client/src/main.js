import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import './registerServiceWorker'
import routes from './router'
import store from './store'
import ViewUI from 'view-design'
import './themes/index.less'
import http from './http'
import * as Cookies from 'js-cookie'
import config from './config'

Vue.config.productionTip = false
// 挂载 $X 命名空间
Vue.prototype.$X = {
  http: http(Vue),
  Cookies,
  config
}

Vue.use(ViewUI)
// 注册路由
Vue.use(VueRouter)

const routerInstance = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

new Vue({
  router: routerInstance,
  store,
  render: h => h(App)
}).$mount('#app')
