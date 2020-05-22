/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */
// import Vue from 'vue'
import axios from 'axios'

export default function (Vue) {
  // 创建 实例
  const http = axios.create({
    baseURL: process.env.VUE_APP_API_BASE,
    withCredentials: true
  })
  // 设置 拦截器
  http.interceptors.request.use((config) => {
    // loading 进度条启动
    Vue.prototype.$Loading.start()
    const $X = Vue.prototype.$X
    const tokenKey = $X.config.cookie.getItem('token')
    const tokenVal = $X.Cookies.get(tokenKey) || ''
    // 设置请求头
    config.headers.common[tokenKey] = tokenVal

    return config
  }, function (error) {
    return Promise.reject(error)
  })
  http.interceptors.response.use(function (response) {
    // loading 进度条关闭
    Vue.prototype.$Loading.finish()
    const $X = Vue.prototype.$X
    // 返回数据
    const resData = response && response.data ? response.data : response
    if (resData) {
      // 弹窗提示
      if (resData.code !== 200) {
        Vue.prototype.$Message.error(response.msg || resData.msg || Vue.prototype.$t('L00134'))
        if (resData.code === 9999) {
          // 清除存储的信息
          $X.utils.storage.clear.apply(Vue.prototype, [true])
        }
        return Promise.reject(new Error(response.msg || resData.msg || Vue.prototype.$t('L00134'))).catch(function (result) {
          console.log(result)
        })
      }
    } else {
      Vue.prototype.$Message.error(Vue.prototype.$t('L00135'))
      return Promise.reject(new Error(Vue.prototype.$t('L00135'))).catch(function (result) {
        console.log(result)
      })
    }
    return resData
  }, function (error) {
    Vue.prototype.$Message.error(error.message)
    return Promise.reject(error)
  })
  return http
}
