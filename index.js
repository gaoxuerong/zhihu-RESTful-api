const Koa = require('koa')
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path =require('path')
const app = new Koa()
const routing = require('./routes')
const { connectionStr } = require('./config')
mongoose.connect(connectionStr, { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log(`cloud database connect success!`))
mongoose.connection.on('error', console.error)
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(error({
  postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))
app.use(koaBody({
  multipart: true, // 表示支持文件
  formidable: {
    uploadDir: path.join(__dirname, 'public/uploads'),
    keepExtensions: true
  }
})) // 解析请求体
app.use(parameter(app))
routing(app)
app.listen(3000, 'localhost',() => {
  console.log(`port 3000`)
})
