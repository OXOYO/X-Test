**[koa-basic-auth](https://github.com/koajs/basic-auth)**

  源码加上注释、空行也就50行，所以理解起来还是相对容易一些，下面是在源码的上加了一些中文注释。
  核心其实是对 `basic-auth` 的封装调用。
  
```
https://github.com/koajs/basic-auth/edit/master/index.js

'use strict';

// 模块依赖
const auth = require('basic-auth');
const compare = require('tsscmp');

/**
 * Return basic auth middleware with
 * the given options:
 *
 *  - `name` username
 *  - `pass` password
 *  - `realm` realm
 *
 * @param {Object} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function(opts){
  // 处理opts参数
  opts = opts || {};

  // 参数健壮，name、pass必传，否则抛出异常
  if (!opts.name && !opts.pass)
    throw new Error('Basic auth `name` and/or `pass` is required');
   
  // 处理安全域
  if (!opts.realm) opts.realm = 'Secure Area';

  // 返回构造函数
  return function basicAuth(ctx, next) {
    // 将ctx上下文传递给 basic-auth 进行验证
    const user = auth(ctx);
    // 判断 user，并与opts进行比较
    if (
      !user ||
      (opts.name && !compare(opts.name, user.name)) ||
      (opts.pass && !compare(opts.pass, user.pass))
    )
      // 验证失败返回401错误
      return ctx.throw(
        401,
        null,
        {
          headers: {
            'WWW-Authenticate': 'Basic realm="' + opts.realm.replace(/"/g, '\\"') + '"'
          }
        }
      );
    // 验证成功进入下一个中间件
    return next();
  };
};

```
