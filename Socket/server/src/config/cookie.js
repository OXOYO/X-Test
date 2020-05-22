/**
 * Created by OXOYO on 2019/4/3.
 *
 * Cookie配置
 */

export default {
  prefix: 'x-chat-',
  keys: {
    account: 'a',
    token: 't',
    locale: 'l',
    secret: 'secret'
  },
  getItem: function (key) {
    return key ? this.prefix + this.keys[key] : ''
  }
}
