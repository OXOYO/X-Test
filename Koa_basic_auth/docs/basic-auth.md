**[basic-auth](https://github.com/jshttp/basic-auth)**

  源码也很简洁，仅有130行。

```
https://github.com/jshttp/basic-auth/edit/master/index.js
 
/*!
 * basic-auth
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

// 模块依赖
var Buffer = require('safe-buffer').Buffer

// 模块导出
module.exports = auth
module.exports.parse = parse

/**
 * RegExp for basic auth credentials
 *
 * credentials = auth-scheme 1*SP token68
 * auth-scheme = "Basic" ; case insensitive
 * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
 * @private
 */

// 证书正则
var CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/

/**
 * RegExp for basic auth user/pass
 *
 * user-pass   = userid ":" password
 * userid      = *<TEXT excluding ":">
 * password    = *TEXT
 * @private
 */
// 用户名、密码正则
var USER_PASS_REGEXP = /^([^:]*):(.*)$/

/**
 * Parse the Authorization header field of a request.
 *
 * @param {object} req
 * @return {object} with .name and .pass
 * @public
 */
// auth验证函数
function auth (req) {
  // 参数健壮，req必传，否则抛出异常
  if (!req) {
    throw new TypeError('argument req is required')
  }
  // 参数健壮，req类型为object，否则抛出异常
  if (typeof req !== 'object') {
    throw new TypeError('argument req is required to be an object')
  }

  // 获取请求头中的 Authorization 信息
  var header = getAuthorization(req)

  // 返回格式化请求头
  return parse(header)
}

// 解码Base64字符串
function decodeBase64 (str) {
  return Buffer.from(str, 'base64').toString()
}

// 获取请求头中的 Authorization 信息
function getAuthorization (req) {
  // 健壮判断
  if (!req.headers || typeof req.headers !== 'object') {
    throw new TypeError('argument req is required to have headers property')
  }
  // 返回请求头下的 Authorization 字段信息
  return req.headers.authorization
}

/**
 * 格式化授权信息
 *
 * @param {string} string
 * @return {object}
 * @public
 */
function parse (string) {
  // 健壮判断
  if (typeof string !== 'string') {
    return undefined
  }

  // 搜索 Authorization 信息中的凭证
  var match = CREDENTIALS_REGEXP.exec(string)
  
  // 没查到凭证信息则返回undefined
  if (!match) {
    return undefined
  }

  // 解码user、pass
  var userPass = USER_PASS_REGEXP.exec(decodeBase64(match[1]))
  
  // 没查到用户信息则返回undefined
  if (!userPass) {
    return undefined
  }

  // 返回 Credentials 凭证实例
  return new Credentials(userPass[1], userPass[2])
}

// Credentials 构造函数
function Credentials (name, pass) {
  this.name = name
  this.pass = pass
}

```
