const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const usersRouters = new Router({prefix: '/users'}) //前缀
app.use(static(path.join(__dirname)))
const auth = async (ctx, next) => { //安全相关中间件
  if(ctx.url !== '/users') {
    ctx.throw(401)
  }
  await next()
}
router.get('/',auth,ctx => {
  ctx.body = '123'
})
usersRouters.get('/',auth,ctx => {
  ctx.body = 'xuerong❤️'
})
usersRouters.get('/:id',auth,ctx => {
  ctx.body = `${ctx.params.id}`
})
// usersRouters.post('/',auth,ctx => {
//   ctx.body = '创建用户接口'
// })
app.use(router.routes())
app.use(usersRouters.routes()) //前缀
app.use(usersRouters.allowedMethods()) // 响应options方法，告诉他所支持的请求方法
app.listen(3000, 'localhost',() => {
    console.log(`port 3000`)
})
