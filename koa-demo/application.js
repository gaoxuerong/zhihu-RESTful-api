const Emitter = require('events')
const http = require('http')
const request = require('./request')
const response = require('./response')
const context = require('./context')
class Application extends Emitter{
  constructor () {
    super()
    this.middleware = []
    // 使用 Object.create()，拥有了原有的功能，仅仅拥有了原有的功能，将对象原型链上hasOwnProperty等属性去掉了
    this.request = Object.create(request)
    this.response = Object.create(response)
    this.context = Object.create(context)
  }
  createContext (req, res) {
    const ctx = this.context
    ctx.request = this.request // ctx.request ctx.response是koa封装的
    ctx.response = this.response
    ctx.req = ctx.request.req = req // ctx.req ctx.res是默认的请求和响应
    ctx.res = ctx.request.res = res
    return ctx
  }
   // 中间件组合
  compose(ctx, middleware) {
    function dispath(index) {
      if (index === middleware.length) { return () => {}}
      const middlewareitem = middleware[index]
      return Promise.resolve(middlewareitem(ctx, () => dispath(index + 1)))
    }
    dispath(0)
  }
  // 处理request请求
  handleRequest (req, res) {
    // 先创建上下文
    const ctx = this.createContext(req, res)
    // 再把所有中间件进行组合
    this.compose(ctx, this.middleware)
  }
  // 收集中间件
  use (fn) {
    this.middleware.push(fn)
  }
  // 创建服务并监听端口号
  listen (...args) {
    const server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }
}
module.exports = Application
