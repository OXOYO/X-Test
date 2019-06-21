/**
 * Created by OXOYO on 2019/6/18.
 *
 *
 */

const http2 = require('http2')
const fs = require('fs')

const server = http2.createSecureSErver({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fas.readFileSync('localhost-cert.pem')
})

server.on('error', err => console.error(err))

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html',
    'status': 200
  })
  stream.end('<h1>Hello World</h1>')
})

server.listen(8848)
