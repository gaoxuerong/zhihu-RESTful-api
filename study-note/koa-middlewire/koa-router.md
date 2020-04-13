 # koa-router
 koa-router源码中方法还是挂载在原型上，没有采用es6的class写法，失望😢；
包括的方法有7种：'HEAD',
'OPTIONS',
'GET',
'PUT',
'PATCH',
'POST',
'DELETE'
通过for循环的方式将7种方法挂载到原型上，然后拿到register方法去注册；
```
for (var i = 0; i < methods.length; i++) {
  function setMethodVerb(method) {
    Router.prototype[method] = function(name, path, middleware) {
      var middleware;
      if (typeof path === "string" || path instanceof RegExp) {
        middleware = Array.prototype.slice.call(arguments, 2);
      } else {
        middleware = Array.prototype.slice.call(arguments, 1);
        path = name;
        name = null;
      }
      this.register(path, [method], middleware, {
        name: name
      });
      return this;
    };
  }
  setMethodVerb(methods[i]);
}
```
register方法里边的：
```
var route = new Layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || "",
    ignoreCaptures: opts.ignoreCaptures // 忽视大小写
  });
  stack.push(route);
  return route;
```
主要核心在new Layer里边；

#### 设置前缀的逻辑
```
if (router.opts.prefix) cloneLayer.setPrefix(router.opts.prefix);
// 其实就是下边的逻辑
Layer.prototype.setPrefix = function (prefix) {
  if (this.path) {
    if (this.path !== '/' || this.opts.strict === true) {
      this.path = prefix + this.path;
    } else {
      this.path = prefix;
    }
    this.paramNames = [];
    this.regexp = pathToRegexp(this.path, this.paramNames, this.opts);
  }
  return this;
};
```
#### del是delete的一个映射
```
// Alias for `router.delete()` because delete is a reserved word
Router.prototype.del = Router.prototype['delete'];
```
提到allowedMethods的作用，首先先说一下http options的作用
- 检测服务器所支持的请求方法。 可以使用 OPTIONS 方法对服务器发起请求，以检测服务器支持哪些 HTTP 方法
- CORS 中的预检请求。 在 CORS 中，可以使用 OPTIONS 方法发起一个预检请求，以检测实际请求是否可以被服务器所接受
### allowedMethods的作用
- 没有加allowedMethods的情况下，给接口发送options请求，结果返回404，加上allowedMethods，就返回200，并且通过Allow字段告诉他所支持的请求方法
- 相应的返回405（不允许）和501（没实现）；比如url只是实现了get方法，但是没实现post方法，用post方法访问该接口就返回405；但是用LINK方法就会返回501，因为koa这个框架不支持LINK这个
生僻方法；
```
// 对应源代码
return function allowedMethods(ctx, next) {
    return next().then(function() {
      var allowed = {};
      if (!ctx.status || ctx.status === 404) {
        for (var i = 0; i < ctx.matched.length; i++) {
          var route = ctx.matched[i];
          for (var j = 0; j < route.methods.length; j++) {
            var method = route.methods[j];
              allowed[method] = method
          }
        }

        var allowedArr = Object.keys(allowed);
        if (!~implemented.indexOf(ctx.method)) {
          if (options.throw) {
            var notImplementedThrowable;
            if (typeof options.notImplemented === 'function') {
              notImplementedThrowable = options.notImplemented(); // set whatever the user returns from their function
            } else {
              notImplementedThrowable = new HttpError.NotImplemented();
            }
            throw notImplementedThrowable;
          } else {
            ctx.status = 501;
            ctx.set('Allow', allowedArr.join(', '));
          }
        } else if (allowedArr.length) {
          if (ctx.method === 'OPTIONS') {
            ctx.status = 200;
            ctx.body = '';
            ctx.set('Allow', allowedArr.join(', '));
          } else if (!allowed[ctx.method]) {
            if (options.throw) {
              var notAllowedThrowable;
              if (typeof options.methodNotAllowed === 'function') {
                notAllowedThrowable = options.methodNotAllowed(); // set whatever the user returns from their function
              } else {
                notAllowedThrowable = new HttpError.MethodNotAllowed();
              }
              throw notAllowedThrowable;
            } else {
              ctx.status = 405;
              ctx.set('Allow', allowedArr.join(', '));
            }
          }
        }
      }
    });
  };
```
koa-router里边还引用了一个koa-compose，
compose 是一个工具函数，通过这个工具函数组合后，按 app.use() 的顺序同步执行，也就是形成了 洋葱圈 式的调用。
这个函数的源代码不长，不到50行，
利用递归实现了 Promise 的链式执行，不管中间件中是同步还是异步都通过 Promise 转成异步链式执行。