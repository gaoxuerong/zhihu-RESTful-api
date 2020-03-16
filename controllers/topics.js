const Topic = require('../models/topics')
class TopicsControler {
  async find(ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await Topic
      .find({name: new RegExp(ctx.query.q)}) // 里边的内容是用正则表达式做的模糊搜索
      .limit(perPage)
      .skip(page * perPage) // limit,skip做分页限制，limit(10)是每页显示10条，skip(10)是跳过前10项，
  }
  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter( f => f).map(f => ' +' + f).join('')
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    ctx.body = topic
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topic
  }
  async checkTopicExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '话题不存在')
    }
    await next()
  }
}
module.exports = new TopicsControler()