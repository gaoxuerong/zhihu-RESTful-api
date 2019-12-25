const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const app = new Koa()
const routing = require('./routes')
// const auth = async (ctx, next) => { //安全相关中间件
//   if(ctx.url !== '/users') {
//     ctx.throw(401)
//   }
//   await next()
// }
app.use(bodyparser()) // 解析请求体
routing(app)
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
