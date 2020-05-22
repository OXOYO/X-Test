/**
 * Created by OXOYO on 2020/5/21
 *
 *
 */

const handleMsg = function (content, contentType = 'text', type = 1) {
  return {
    time: new Date().getTime(),
    // 类型，0：当前用户client  1：服务端
    type,
    content,
    contentType
  }
}

export default {
  handleMsg
}
