/**
 * Created by OXOYO on 2019/3/14.
 *
 *
 */

// 绑定通知
const bindShowNotice = function () {
  let el = document.querySelector('#showNotice')

  if (el) {
    el.addEventListener('click', function () {
      console.log('showNotice clicked')
      let date = new Date()
      let title = '通知'
      let msg = `现在时间：${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      let options = {
        body: msg,
        tag: '',
        icon: './icon.png'
        // ,
        // 是否保持
        // requireInteraction: true
      }
      let notification = new Notification(title, options)
      // 关闭
      setTimeout(function() {
        notification.close()
      }, 5000)
    })
  }
}

// 1.先检查浏览器是否支持
if (!('Notification' in window)) {
  console.warn('浏览器不支持消息通知！')
  // 1.判断通知权限
} else if(Notification.permission === 'granted'){
  console.log('用户已允许通知')
  // 绑定通知事件
  bindShowNotice()
}else if(Notification.permission === 'denied'){
  console.warn('用户已拒绝通知')
}else{
  console.warn('用户还没选择，请先申请权限')
  // 1.请求权限
  Notification.requestPermission().then(function(permission) {
    if(permission === 'granted'){
      console.log('用户允许通知')
      // 绑定通知事件
      bindShowNotice()
    }else if(permission === 'denied'){
      console.warn('用户拒绝通知')
    }
  })
}
