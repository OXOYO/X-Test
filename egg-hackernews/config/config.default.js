/**
 * Created by OXOYO on 2019/6/5.
 *
 *
 */

// Cookie安全字符串
exports.keys = '1234567890'

// 添加 view 配置
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks'
  }
}

// 添加 news 配置
exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news.firebaseio.com/v0'
}
