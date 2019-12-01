const proto = {};
function defineGetter(property, key) {
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
