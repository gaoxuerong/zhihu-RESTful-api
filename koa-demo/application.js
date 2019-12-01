const Emitter = require('events')
const http = require('http')
const request = require('./request')
const response = require('./response')
const context = require('./context')
class Application extends Emitter{
  constructor () {
    super()
    this.middleware = []
    this.request = Object.create(request) // 使用 Object.create()继承原有的功能，又不污染原有的对象
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
  // 处理request请求
  handleRequest (req, res) {
    // 先创建上下文
    const ctx = this.createContext(req, res)
    // 再把所有中间件进行组合
    this.middleware[0](ctx)
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
