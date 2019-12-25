class UsersControler {
  find(ctx) {
    ctx.set("Allow", "GET, POST, DELETE, PUT, PATCH");
    ctx.body = [{ name: "xuerong" }, {name: 'zhangsan'}];
  }
  findById(ctx) {
    if (ctx.params.id * 1 > 10) {
      ctx.throw(412,'ggggg')
    }
    ctx.body = { name: "xuerong" };
  }
  created(ctx) {
    ctx.body = { name: "xuerong" };
  }
  update(ctx) {
    ctx.body = { name: "xuerong123" };
  }
  delete(ctx) {
    // 没有内容但是成功了，https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/204
    ctx.status = 204;
  }
}
module.exports = new UsersControler()