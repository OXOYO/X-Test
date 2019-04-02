var unified = require('unified')
var parse = require('remark-parse')
var stringify = require('remark-stringify')

unified()
  // 使用parse进行解析
  .use(parse, {commonmark: true})
  // 使用stringify进行编译
  .use(stringify)
  .process('# This a test case!',function(err, file) {
      console.log('remark err', err)
      console.log('remark file', file)
  })

/*
// 运行
E:\WorkSpace_Webstorm\X-Test\Markdown_Parser\example>node unified_remark_001.js
// 输出结果
remark err null
remark file VFile {
  data: {},
  messages: [],
  history: [],
  cwd: 'E:\\WorkSpace_Webstorm\\X-Test\\Markdown_Parser\\example',
  contents: '# This a test case!\n' }

*/
