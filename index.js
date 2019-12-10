const Koa = require('koa')
const app = new Koa()
const path = require('path')
const static = require('koa-static')
debugger
app.use(static(path.join(__dirname)))
app.use(async (ctx, next) => {
  ctx.body = 'fff'
  await next()
})
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
