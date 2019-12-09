const Koa = require('./koa-demo/application')
const app = new Koa()
const fs = require('fs')
const path = require('path')
app.use(async (ctx, next) => {
  ctx.body = 'fff'
  await next()
})
app.use(async (ctx, next) => {
  ctx.body = '123'
  throw new Error('Error--hhhh')
})
app.on('error',(e) => {
  console.log('fff-fff',e)
})
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
