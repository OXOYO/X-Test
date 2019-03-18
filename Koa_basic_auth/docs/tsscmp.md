**[tsscmp](https://github.com/suryagh/tsscmp)**

## 简介

  原文：
  
  Prevents [timing attacks](https://codahale.com/a-lesson-in-timing-attacks/) using Brad Hill's [Double HMAC](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/) pattern to perform secure string comparison. Double HMAC 
  avoids the timing atacks by blinding the timing channel using random time per attempt comparison against iterative 
  brute force attacks.
    
  谷歌翻译：
    
  使用Brad Hill的[Double HMAC](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/)模式防止[定时攻击](https://codahale.com/a-lesson-in-timing-attacks/)，以执行安全的字符串比较。双HMAC通过使用每次尝试的随机时间与迭代暴力攻击进行比较来使定时信道盲化，从而避免了定时攻击。


## 源码

```
https://github.com/suryagh/tsscmp/blob/master/lib/index.js

'use strict';

// Implements Brad Hill's Double HMAC pattern from
// https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/.
// The approach is similar to the node's native implementation of timing safe buffer comparison that will be available on v6+.
// https://github.com/nodejs/node/issues/3043
// https://github.com/nodejs/node/pull/3073

// 导入crypto，提供通用的加密和哈希算法
var crypto = require('crypto');

// buffer相等判断函数 
function bufferEqual(a, b) {
  // 长度不等返回false
  if (a.length !== b.length) {
    return false;
  }
  
  // `crypto.timingSafeEqual`是在Node v6.6.0中引入的
  // <https://github.com/jshttp/basic-auth/issues/39>
  // 如果crypto提供了timingSafeEqual方法，则调用该方法进行验证
  if (crypto.timingSafeEqual) {
    // 返回校验结果
    return crypto.timingSafeEqual(a, b);
  }
  // 否则，遍历a，判断a与b是否完全相等
  for (var i = 0; i < a.length; i++) {
    // 如果不等，则返回false
    if (a[i] !== b[i]) {
      return false;
    }
  }
  // 所有校验方法通过则返回true
  return true;
}

// 时间安全比较
function timeSafeCompare(a, b) {
  var sa = String(a);
  var sb = String(b);
  // 生成非密码学强度的伪随机数据
  var key = crypto.pseudoRandomBytes(32);
  // 创建并返回一个hmac对象，也就是通过给定的加密算法和密钥生成的加密图谱
  var ah = crypto.createHmac('sha256', key).update(sa).digest();
  var bh = crypto.createHmac('sha256', key).update(sb).digest();
  // 比较
  return bufferEqual(ah, bh) && a === b;
}

module.exports = timeSafeCompare;

```

## 相关文档

[crypto.createHmac](https://nodejs.org/dist/latest-v10.x/docs/api/crypto.html#crypto_crypto_createhmac_algorithm_key_options)
