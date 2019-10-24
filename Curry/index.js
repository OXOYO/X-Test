/**
*
* 柯里化
*
* 用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数
* */


var curry = fn =>
  judge = (...args) =>
    args.length === fn.length
      ? fn(...args)
      : (arg) => judge(...args, arg)
