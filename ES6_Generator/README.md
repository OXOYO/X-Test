# ES6_Generator

## 示例

```
// run
node generator.js

// result
1 { value: 'hello', done: false }
2 { value: 'world', done: false }
3 { value: 'ending', done: true }
4 { value: undefined, done: true }
```

**调用`next`方法将指针移向下一个状态**

yield表达式是暂停执行的标记，而next方法可以恢复执行。


## 资料

[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/generator)
