 # koa-bodyparser
 > 首先要说一下post提交数据的方式，这样才能更进一步了解解析body的包。
 > - application/x-www-form-urlencoded；浏览器的原生form表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据,这种数据方式最为常见；
 > - multipart/form-data；我们使用表单上传文件时，必须让form表单的enctype 等于multipart/form-data，这种方式一般用来上传文件；
 > - application/json；这种方式的数据格式就是最为常见的json格式；

 koa-bodyparser基于co-body。支持 json,默认的form，text，xml类型的post请求。不支持multipart format data，其实就是没有处理文件上传的功能；`残废包😂`;koa-bodyparser基于co-body,co-body基于raw-body，raw-body用的是buffer的流处理方式，先存起来，再吐出来，用的on('data',onData),on('end',onEnd)做监听处理；
 > 另外：对Koa1也支持；
 # koa-body
 和koa-bodyparser相比`支持文件上传`；
 json处理方式：
 ```
 bodyPromise = require('co-body').json(ctx, {
    encoding: opts.encoding,
    limit: opts.jsonLimit,
    strict: opts.jsonStrict,
    returnRawBody: opts.includeUnparsed
  });
 ```
 普通form处理方式
 ```
 bodyPromise = require('co-body').form(ctx, {
    encoding: opts.encoding,
    limit: opts.formLimit,
    queryString: opts.queryString,
    returnRawBody: opts.includeUnparsed
  });
 ```
 上传文件/图片处理方式
 ```
 const forms = require('formidable');
 function formy(ctx, opts) {
  return new Promise(function (resolve, reject) {
    var fields = {};
    var files = {};
    var form = new forms.IncomingForm(opts);
    form.on('end', function () {
      return resolve({
        fields: fields,
        files: files
      });
    }).on('error', function (err) {
      return reject(err);
    }).on('field', function (field, value) {
      if (fields[field]) {
        if (Array.isArray(fields[field])) {
          fields[field].push(value);
        } else {
          fields[field] = [fields[field], value];
        }
      } else {
        fields[field] = value;
      }
    }).on('file', function (field, file) {
      if (files[field]) {
        if (Array.isArray(files[field])) {
          files[field].push(file);
        } else {
          files[field] = [files[field], file];
        }
      } else {
        files[field] = file;
      }
    });
    if (opts.onFileBegin) {
      form.on('fileBegin', opts.onFileBegin);
    }
    form.parse(ctx.req);
  });
}
  bodyPromise = formy(ctx, opts.formidable);
 ```
 前两种方式和koa-bodyparser相似都是引用的co-body，第三种处理方式是引用了formidable，formidable封装方法还是用的es5，很多方法挂载到原型链上😂；
 # koa-better-body
 相比于前两个，这个比较全面，json，buffer，text，文件上传都支持，用的generator的方式，还支持koa1；