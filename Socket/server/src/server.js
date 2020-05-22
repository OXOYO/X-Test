/**
 * Created by OXOYO on 2017/11/2.
 */
require('babel-register')
require('babel-polyfill')

const app = require('./app')
const config = require('./config')

var server = app.listen(config.system.port, function () {
  let serverPath = config.system.protocol + config.system.host + (config.system.port ? ':' + config.system.port : config.system.port)
  console.log('RESTful API Server is listening to ' + serverPath)
})

exports = module.exports = server
