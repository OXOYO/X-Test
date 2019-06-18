# @vuese/parser 示例

## 运行

```
E:\WorkSpace_Webstorm\X-Test\vuese>node parser.js
parser { parser: [Function: parser$1],
  sfcToAST: [Function: sfcToAST],
  parseJavascript: [Function: parseJavascript],
  parseTemplate: [Function: parseTemplate],
  isVueComponent: [Function: isVueComponent],
  isVueOption: [Function: isVueOption],
  runFunction: [Function: runFunction],
  getValueFromGenerate: [Function: getValueFromGenerate],
  getComments: [Function: getComments],
  getComponentDescribe: [Function: getComponentDescribe],
  isCommentLine: [Function: isCommentLine],
  isCommentBlock: [Function: isCommentBlock] }
parserRes { componentDesc: { default: [] },
  name: 'Test',
  props:
   [ { name: 'p1', type: 'String', describe: [] },
     { name: 'p2', type: 'Boolean', describe: [], default: 'false' },
     { name: 'p3',
       type: null,
       describe: [],
       validator:
        'validator(value) {\n  return [\'circle\', \'circle-outline\'].includes(value);\n}' } ] }

E:\WorkSpace_Webstorm\X-Test\vuese>

```

## 总结

**使用`@vuese/parser`包可以用来解析`vue`组件的`props`**，进而可以做诸如自动渲染、可视化编辑器等功能。
