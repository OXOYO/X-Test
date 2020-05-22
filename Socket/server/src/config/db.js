/**
 * Created by OXOYO on 2019/4/3.
 *
 * 数据库配置
 */

export default {
  // 开发环境
  development: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'x-chat'
  },
  // 正式环境
  production: {
    host: '',
    port: 3306,
    username: '',
    password: '',
    database: ''
  }
}
