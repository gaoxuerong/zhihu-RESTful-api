const proto = {};
function defineGetter(property, key) {
  // Object.prototype.__defineGetter__()
  // 已废弃；方法可以将一个函数绑定在当前对象的指定属性上，当那个属性的值被读取时，你所绑定的函数就会被调用。
  // __defineSetter__同理
  // koa源码用的是delegates这个npm包，这个npm包内部也是用的__defineGetter__，和__defineSetter__
  proto.__defineGetter__(key, function() {
    return this[property][key];
  });
}
function defineSetter(property, key) {
  proto.__defineSetter__(key, function(value) {
    this[property][key] = value
  });
}
defineGetter("request", "path");
defineGetter('request','url')
defineGetter('response','body')
defineSetter('response','body')
module.exports = proto;
