const Koa = require('./koa-demo/application')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})
app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
