> koa-views 是模版渲染的中间件，是和koa2搭配使用的；koa-views 底层使用的是 consolidate这个npm包，支持很多种模版引擎，在使用koa-views的时候，还要装上相应模版引擎的npm包，koa-views里边也用了koa-send这个包;当
 ```
 app.use(views(__dirname))
 ```
 没map的时候直接返回静态文件,是不会渲染数据的。所以map选项是必不可少的。
 ```
    if (isHtml(suffix) && !map) {
      return send(ctx, paths.rel, {
        root: path
      })
    }
    /*suffix一般都是html，因为
    extension = 'html'
    getPaths(path, relPath, extension).then(paths => {
    const suffix = paths.ext
    ......
    }
    除非对extension赋值；
    */
 ```
 consolidate这个npm包对应的渲染方式；
 ```
const consolidate = require('consolidate')
engineSource = consolidate
const engineName = map && map[suffix] ? map[suffix] : suffix
const render = engineSource[engineName]
return render(resolve(path, paths.rel), state).then(html => {
    // since pug has deprecated `pretty` option
    // we will use the `pretty` package in the meanwhile
    if (locals.pretty) {
      debug('using `pretty` package to beautify HTML')
      html = pretty(html)
    }

    if (autoRender) {
      ctx.body = html
    } else {
      return Promise.resolve(html)
    }
  })
 ```
 > 用法：
```
//template.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <%arr.forEach(a=>{%>
    <li><%=a%></li>
  <%})%>
</body>
</html>
```

```
const Koa = require('koa');
const path = require('path');
const Router = require('koa-router')
const views = require('koa-views');
const app = new Koa();
const router = new Router();
app.use(router.routes())
app.use(views(path.resolve(__dirname), {
  map: { html: 'ejs' }
}));
router.get('/',async (ctx,next)=> {
 await ctx.render('template.html',{arr:[1,2,3]})
})
app.listen(3000);
```
ejs中render函数简化版本
```
123
```