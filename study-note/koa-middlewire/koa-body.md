# koa-bodyparser
 > 首先要说一下post提交数据的方式，这样才能更进一步了解解析body的包。
 > - application/x-www-form-urlencoded；浏览器的原生form表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据,这种数据方式最为常见；
 > - multipart/form-data；我们使用表单上传文件时，必须让form表单的enctype 等于multipart/form-data，这种方式一般用来上传文件；
 > - application/json；这种方式的数据格式就是最为常见的json格式；

 koa-bodyparser基于co-body。支持 json,默认的form，text，xml类型的post请求。不支持multipart format data，其实就是没有处理文件上传的功能；`残废包😂`
 对Koa1也支持；
# koa-body
# koa-better-body