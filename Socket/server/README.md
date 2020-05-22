# X-Admin-API-Generator-Koa

基于Vue的后台管理平台脚手架配套API服务。

[![node](https://img.shields.io/badge/node-v7.6.0+-blue.svg)](https://nodejs.org/)
[![GitHub package version](https://img.shields.io/github/package-json/v/OXOYO/X-Admin-API-Generator-Koa.svg)]()
[![dependencies Status](https://david-dm.org/OXOYO/X-Admin-API-Generator-Koa/status.svg)](https://david-dm.org/OXOYO/X-Admin-API-Generator-Koa)
[![codebeat badge](https://codebeat.co/badges/824b49d9-dd7f-4502-9965-76aef840f8d2)](https://codebeat.co/projects/github-com-oxoyo-x-admin-api-generator-koa-master)
[![license](https://img.shields.io/github/license/OXOYO/X-Admin-API-Generator-Koa.svg)]()

## 预览

[online](http://oxoyo.co/X-Admin-Generator-Vue/)

超级管理员：root 123123

管理员：admin 123123

## 开始
```bash
  git clone
  npm i
  导入 `sql/x-admin-api-generator-koa.sql` 文件到数据库
  npm run dev
```
Node.js 版本需 >= 7.6.0.

## 开发
  1.编辑 config

  2.使用 [sequelize-auto](https://github.com/sequelize/sequelize-auto) 将数据库导出为 schema 模型

  ```bash
    sequelize-auto -o "./src/schema" -d x-admin-api-generator-koa -h localhost -u root -p 3306 -e mysql
  ```

  3.创建新模块目录、文件
  ```bash
    apps
      \_ newModules
          Ctrl.js
          Model.js
          Routers.js
  ```

## 打包
```bash
  npm run build
```

## 生产环境
```bash
  pm2 start ecosystem.config.js
```

## TODO

## License
[MIT](http://opensource.org/licenses/MIT)
