const fs = require('fs')
// 导入 parser 函数
const parser = require('@vuese/parser')
console.log('parser', parser)

// 读取 vue 文件内容
const source = fs.readFileSync('test.vue', 'utf-8')

// 使用 parser 函数解析并得到结果
try {
  const parserRes = parser.parser(source)
  console.log('parserRes', parserRes)
} catch(e) {
  console.error(e)
}
