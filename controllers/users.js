const User = require('../models/users')
class UsersControler {
  async find(ctx) {
    ctx.body = await User.find()
  }
  async findById(ctx) {
    const user = await User.finfindByIdd(ctx.params.id)
    if (!user) {
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user
  }
  async created(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      }
    })
    const user = await new User(ctx.request.body).save()
    ctx.body = user
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