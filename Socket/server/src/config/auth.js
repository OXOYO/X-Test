/**
 * Created by OXOYO on 2019/4/3.
 *
 * 校验相关配置
 */

export default {
  // 校验排除项
  unless: {
    // 校验token时排除的api
    verifyToken: {
      api: [
        '/Platform/user/signIn',
        '/Platform/components/wallpaper/bing'
      ]
    },
    // 校验权限时排除的api、resource
    verifyAccess: {
      api: [],
      resource: []
    }
  }
}
