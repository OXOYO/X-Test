## marked

[Github](https://github.com/markedjs/marked)

### 安装

```
// 全局安装cli
npm -g install marked
// 安装到项目
npm install marked --save
```

### 使用

**CLI**

```
$ marked -o hello.html
hello world
^D
$ cat hello.html
<p>hello world</p>
```

```
$ marked -s "*hello world*"
<p><em>hello world</em></p>
```

**浏览器**

```
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Marked in the browser</title>
</head>
<body>
  <div id="content"></div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script>
    document.getElementById('content').innerHTML =
      marked('# Marked in browser\n\nRendered by **marked**.');
  </script>
</body>
</html>
```

### 配置
