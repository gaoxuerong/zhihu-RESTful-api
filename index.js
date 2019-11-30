const Koa = require('koa')
const app = new Koa()

app.use((ctx,next) => {
  ctx.body = `🚀`
  console.log(ctx.req.url)
  console.log(ctx.request.url)
  console.log(ctx.request.req.url)
  console.log(ctx.request.req === ctx.req)
  // 当我去ctx上边取值时会去ctx.request上边取值，做了一层拦截；
})
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
