const Koa = require('koa')
const KoaRouter = require('koa-router')
const ioredis = require('ioredis')

const redisInstance = new ioredis({
  host: '127.0.0.1',
  port: '6379',
  prefix: 'oto',
  ttl: 60 * 60 * 24,
  db: 0
})


const routerInstance = new KoaRouter({
  prefix: '/koa_redis'
})

routerInstance.get('/', async (ctx, next) => {
  await next()
  ctx.status = 200
  ctx.body = {}
})

routerInstance.get('/list', async (ctx, next) => {
  await next()
  let res = await redisInstance.get('time_now')
  ctx.status = 200
  ctx.body = res
})

routerInstance.post('/add', async (ctx, next) => {
  await next()
  let res = await redisInstance.set('time_now', new Date())
  console.log('res' ,res)
  ctx.status = 200
  ctx.body = res
})

// 实例化app
const app = new Koa()

app.use(routerInstance.routes())
app.use(routerInstance.allowedMethods({
    throw: true
  })
)

app.listen(3366, function () {
  console.log('RESTful API Server is listening to http://localhost:3366')
})
