/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */

export default {
  prefix: 'x-chat-',
  path: '/',
  items: {
    account: 'a',
    token: 't'
  },
  // 退出时无需清除的cookie key
  unless: [],
  getItem (key) {
    return key ? this.prefix + this.items[key] : ''
  }
}
