koa-static就是对koa-send的浅封装，koa-static只支持get head;默认添加了index.html
```
  if (opts.index !== false) opts.index = opts.index || 'index.html'
    // 支持的方法
  if (ctx.method === 'HEAD' || ctx.method === 'GET') {
        try {
          done = await send(ctx, ctx.path, opts)
        } catch (err) {
          if (err.status !== 404) {
            throw err
          }
        }
      }
```
用法:
 ```
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const app = new Koa()
const staticPath = './static'
app.use(static(
  path.join( __dirname,  staticPath)
))
app.use( async ( ctx ) => {
  ctx.body = 'hello world'
})
app.listen(3000, () => {
  console.log('static-use-middleware is starting at port 3000')
})
```
koa-send:
最重要的一行：

```ctx.body = fs.createReadStream(path)```😂

其余的是一些完善处理：

 ```隐藏文件禁止显示；path解码 ；File type；Last-Modified和Cache-Control处理；max-age=处理；path路径是不是文件夹等处理；setHeaders；gzip等等```