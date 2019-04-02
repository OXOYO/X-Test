var unified = require('unified')
var parse = require('remark-parse')
var stringify = require('remark-stringify')

// 将文本解析为语法树
var parseTree = unified()
    .use(parse)
    .parse('# Hello world!')

console.log('parseTree', JSON.stringify(parseTree))

// 将语法树编译为文本
var stringifyTree = unified()
    .use(stringify)
    .stringify(parseTree)

console.log('stringifyTree', stringifyTree)


/*
// 运行
E:\WorkSpace_Webstorm\X-Test\Markdown_Parser\example>node unified_remark_002.js
// 输出结果
parseTree {"type":"root","children":[{"type":"heading","depth":1,"children":[{"type":"text","value":"Hello world
!","position":{"start":{"line":1,"column":3,"offset":2},"end":{"line":1,"column":15,"offset":14},"indent":[]}}],
"position":{"start":{"line":1,"column":1,"offset":0},"end":{"line":1,"column":15,"offset":14},"indent":[]}}],"po
sition":{"start":{"line":1,"column":1,"offset":0},"end":{"line":1,"column":15,"offset":14}}}

stringifyTree # Hello world!

*/
