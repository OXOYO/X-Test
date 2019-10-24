/**
*
* 柯里化
*
* 用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数
* */

// 柯里化
var curry = fn =>
  judge = (...args) =>
    args.length === fn.length
      ? fn(...args)
      : (arg) => judge(...args, arg)

// 测试
var fn = curry(function (a, b, c) {
  console.log([a, b, c])
})

fn('a', 'b', 'c') // ['a', 'b', 'c']
fn('a', 'b')('c') // ['a', 'b', 'c']
fn('a')('b')('c') // ['a', 'b', 'c']
fn('a')('b', 'c') // ['a', 'b', 'c']
