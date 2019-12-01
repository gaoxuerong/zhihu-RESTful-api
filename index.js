const Koa = require('./koa-demo/application')
const app = new Koa()

app.use((ctx,next) => {
  ctx.body = `jhh`
  console.log(ctx.req.path)
  console.log(ctx.request.path)
  console.log(ctx.request.req.path)
  console.log(ctx.path)
  ctx.body = 'hello'
  console.log(ctx.response.body)
  // 当我去ctx上边取值时会去ctx.request上边取值，做了一层拦截；
})
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
