var fs = require('fs')
var path = require('path')
var unified = require('unified')
var createStream = require('unified-stream')
var parse = require('remark-parse')
var stringify = require('remark-stringify')
var vfile = require('vfile')


// 将README_TEST.md转为虚拟文件
let file = vfile({
  contents: fs.createReadStream(path.join(__dirname, './README_TEST.md'))
})
// console.log('file', file)
// 将文件解析为语法树
var parseTree = unified()
  .use(parse)
  .parse(file)

fs.writeFile('parseTree.json', JSON.stringify(parseTree), function (err) {
  if (err) {
    console.log('err', err)
  }
})

// 将语法树编译为文本
var stringifyTree = unified()
  .use(stringify)
  .stringify(parseTree)

fs.writeFile('stringifyTree.json', JSON.stringify(stringifyTree), function (err) {
  if (err) {
    console.log('err', err)
  }
})
