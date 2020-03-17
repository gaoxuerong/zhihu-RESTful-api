const Question = require('../models/questions')
class QuestionsControler {
  async find(ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q) // 用正则表达式做的模糊搜索
    ctx.body = await Question
      .find({$or: [{title: q}, {description: q}]}) // $or语法，匹配多个
      .limit(perPage)
      .skip(page * perPage) // limit,skip做分页限制，limit(10)是每页显示10条，skip(10)是跳过前10项，
  }
  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter( f => f).map(f => ' +' + f).join('')
    const question = await Question.findById(ctx.params.id).select(selectFields).populate('+questioner')
    ctx.body = question
  }
  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      desctiption: { type: 'string', required: false }
    })
    const question = await new Question({...ctx.request.body, questioner: ctx.state.user._id}).save()
    ctx.body = question
  }
  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      desctiption: { type: 'string', required: false }
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }
  async delete(ctx) {
    await Question.findByIdAndDelete(ctx.params.id)
    ctx.status = 204
  }
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.state.question = question
    await next()
  }
  async checkQuestioner(ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() !== ctx.state.user._id ) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
}
module.exports = new QuestionsControler()