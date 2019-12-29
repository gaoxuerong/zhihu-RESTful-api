const jwt = require('jsonwebtoken')
const User = require('../models/users')
const { secret } = require('../config')
class UsersControler {
  async find(ctx) {
    ctx.body = await User.find()
  }
  async findById(ctx) {
    const { fields } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map((f) => ' +' + f).join('')
    const user = await User.findById(ctx.params.id).select(selectFields)
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
      },
      password: {
        type: 'string',
        required: true
      }
    })
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) {
      ctx.throw(409, '用户已经存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  async update(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      headline: {
        type: 'string',
        required: false
      },
      locations: {
        type: 'array',
        itemType: 'string',
        required: false
      },
      business: {
        type: 'string',
        required: false
      },
      employments: {
        type: 'array',
        itemType: 'object',
        required: false
      },
      educations: {
        type: 'array',
        itemType: 'object',
        required: false
      }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user
  }
  async delete(ctx) {
    // 没有内容但是成功了，https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/204
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404,'用户不存在')
    }
    ctx.status = 204;
  }
  async login(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401,'用户名或者密码不正确')
    }
    const { _id, name } = user
    const token = jwt.sign({ _id, name}, secret, {expiresIn: '1d'})
    ctx.body = { token }
  }
  async listFollowing(ctx) { // 获取关注者
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if (!user) {
      ctx.throw(404,'用户不存在')
    }
    ctx.body= user.following
  }
}
module.exports = new UsersControler()