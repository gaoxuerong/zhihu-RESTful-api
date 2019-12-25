用法：
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
let app = new Koa();
let router = new Router();
app.use(views(path.resolve(__dirname), {
  //不设置的话，模板文件要使用.ejs后缀,而不是.htmls后缀
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