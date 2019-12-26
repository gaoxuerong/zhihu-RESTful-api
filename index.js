const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const app = new Koa()
const routing = require('./routes')
const { connectionStr } = require('./config')
mongoose.connect(connectionStr, { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log(`cloud database connect success!`))
mongoose.connection.on('error', console.error)
app.use(error({
  postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))
app.use(bodyparser()) // 解析请求体
app.use(parameter(app))
routing(app)
app.listen(3000, 'localhost',() => {
  console.log(`port 3000`)
})
