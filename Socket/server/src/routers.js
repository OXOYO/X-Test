/**
 * Created by OXOYO on 2017/10/23.
 */

// 实现动态加载路由
const requireDirectory = require('require-directory')
const routers = {}

// 解析apps路由
let apps = requireDirectory(module, './apps')
for (let key in apps) {
  let file = apps[key]['Routers']
  if (file) {
    routers[key] = file.default
  }
}

export default routers
