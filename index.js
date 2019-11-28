const Koa = require('koa')
const app = new Koa()
app.use(async (ctx) => {
    ctx.body = 'hello,雪荣,i ❤️ you'
})
app.listen('3000',() => {
    console.log('3000 port start')
})