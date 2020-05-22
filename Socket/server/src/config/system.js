/**
 * Created by OXOYO on 2019/4/3.
 *
 * 系统配置
 */

export default {
  protocol: 'http://',
  host: 'localhost',
  port: 3002,
  accessHost: [
    'localhost',
    '127.0.0.1'
  ],
  secret: '12345678',
  // 密码正则，6到12位字母数字组合
  passwordReg: /^[\w]{6,12}$/
}
