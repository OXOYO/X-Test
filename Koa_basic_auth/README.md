# koa-basic-auth 示例


## Installation

```
npm i koa-basic-auth
```

## Example

### 源码
[app.js](./app.js)

### 启动服务
```
node app.js
```

### 请求

**验证成功**
```
// request
$ curl -H "Authorization: basic dGo6dG9iaQ==" http://localhost:3000/ -i
// result
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 6
Date: Mon, 18 Mar 2019 08:24:45 GMT
Connection: keep-alive

secret
```

**验证失败**
```
// request
$ curl http://localhost:3000/ -i
// result
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic
Content-Type: text/plain; charset=utf-8
Content-Length: 13
Date: Mon, 18 Mar 2019 08:55:57 GMT
Connection: keep-alive

cant haz that
```

### 源码解析

**[koa-basic-auth](./docs/koa-basic-auth.md)**

**[basic-auth](./docs/basic-auth.md)**

**[tsscmp](./docs/tsscmp.md)**


