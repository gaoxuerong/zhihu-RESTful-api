const Koa = require('./koa-demo/application')
const app = new Koa()
app.use((ctx, next) => {
  ctx.body = 1000
  next()
})
app.use((ctx, next) => {
  ctx.body = 2000
  next()
})
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
