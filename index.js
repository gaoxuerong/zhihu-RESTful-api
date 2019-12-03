const Koa = require('./koa-demo/application')
const app = new Koa()
const logger = function() {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log(`logger`)
      resolve()
    },1000)
  })
}
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})
app.use(async (ctx, next) => {
  console.log(3)
  await logger()
  console.log(4)
})
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
