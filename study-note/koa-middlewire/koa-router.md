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