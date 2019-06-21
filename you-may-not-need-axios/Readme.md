# you-may-not-need-axios

[原文](https://danlevy.net/you-may-not-need-axios/)

[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

## GET 请求

```
fetch('https://api.github.com/orgs/nodejs')
  .then(response => response.json())
  .then(data => {
    console.log(data) // Prints result from `response.json()` in getRequest
  })
  .catch(error => console.error(error))
```

## 自定义请求头

```
fetch('https://api.github.com/orgs/nodejs', {
    headers: new Headers({
      'User-agent': 'Mozilla/4.0 Custom User Agent'
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error => console.error(error))
```

## HTTP 错误处理

```
const isOk = response => response.ok ? response.json() : Promise.reject(new Error('Failed to load data from server'))

fetch('https://api.github.com/orgs/nodejs')
  .then(isOk) // <= Use `isOk` function here
  .then(data => {
    console.log(data) // Prints result from `response.json()`
  })
  .catch(error => console.error(error))
```

## 跨域

`credentials`选项控制您的Cookie是否自动包含在内。

```
fetch('https://api.github.com/orgs/nodejs', {
    credentials: 'include', // Useful for including session ID (and, IIRC, authorization headers)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data) // Prints result from `response.json()`
  })
  .catch(error => console.error(error))
```

## POST 请求 提交JSON

```
postRequest('http://example.com/api/v1/users', {user: 'Dan'})
  .then(data => console.log(data)) // Result from the `response.json()` call

function postRequest(url, data) {
  return fetch(url, {
    credentials: 'same-origin', // 'include', default: 'omit'
    method: 'POST',             // 'GET', 'PUT', 'DELETE', etc.
    body: JSON.stringify(data), // Use correct payload (matching 'Content-Type')
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .catch(error => console.error(error))
}
```

## POST 请求 提交FormData

```
postForm('http://example.com/api/v1/users', 'form#userEdit')
  .then(data => console.log(data))

function postForm(url, formSelector) {
  const formData = new FormData(document.querySelector(formSelector))

  return fetch(url, {
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: formData  // a FormData will automatically set the 'Content-Type'
  })
  .then(response => response.json())
  .catch(error => console.error(error))
}
```

## POST 请求 encode编码

```
postFormData('http://example.com/api/v1/users', {user: 'Mary'})
  .then(data => console.log(data))

function postFormData(url, data) {
  return fetch(url, {
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: new URLSearchParams(data),
    headers: new Headers({
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  })
  .then(response => response.json())
  .catch(error => console.error(error))
}
```

## 上传文件

```
postFile('http://example.com/api/v1/users', 'input[type="file"].avatar')
  .then(data => console.log(data))

function postFile(url, fileSelector) {
  const formData = new FormData()
  const fileField = document.querySelector(fileSelector)

  formData.append('username', 'abc123')
  formData.append('avatar', fileField.files[0])

  return fetch(url, {
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: formData  // Coordinate the body type with 'Content-Type'
  })
  .then(response => response.json())
  .catch(error => console.error(error))
}
```

## 多文件上传

```
<input type='file' multiple class='files' name='files' />
```

```
postFile('http://example.com/api/v1/users', 'input[type="file"].files')
  .then(data => console.log(data))

function postFile(url, fileSelector) {
  const formData = new FormData()
  const fileFields = document.querySelectorAll(fileSelector)

  // Add all files to formData
  Array.prototype.forEach.call(fileFields.files, f => formData.append('files', f))
  // Alternatively for PHPeeps, use `files[]` for the name to support arrays
  // Array.prototype.forEach.call(fileFields.files, f => formData.append('files[]', f))

  return fetch(url, {
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: formData  // Coordinate the body type with 'Content-Type'
  })
  .then(response => response.json())
  .catch(error => console.error(error))
}
```

## 超时

```
function promiseTimeout(msec) {
  return promise => {
    const timeout = new Promise((yea, nah) => setTimeout(() => nah(new Error('Timeout expired')), msec))
    return Promise.race([promise, timeout])
  }
}

promiseTimeout(5000)(fetch('https://api.github.com/orgs/nodejs'))
.then(response => response.json())
.then(data => {
  console.log(data) // Prints result from `response.json()` in getRequest
})
.catch(error => console.error(error)) // Catches any timeout (or other failure)
```
