const Answer = require('../models/answers')
class AnswersControler {
  async find(ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q) // 用正则表达式做的模糊搜索
    ctx.body = await Answer
      .find({content: q, questionId: ctx.params.questionId})
      .limit(perPage)
      .skip(page * perPage) // limit,skip做分页限制，limit(10)是每页显示10条，skip(10)是跳过前10项，
  }
  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (!answer) {
      ctx.throw(404, '答案不存在')
    }
    if (answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有子答案')
    }
    ctx.state.answer = answer
    await next()
  }
  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter( f => f).map(f => ' +' + f).join('')
    const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
    ctx.body = answer
  }
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const answerer =  ctx.state.user._id
    const questionId = ctx.params.questionId
    const answer = await new Answer({...ctx.request.body, answerer: answerer, questionId: questionId}).save()
    ctx.body = answer
  }
}
module.exports = new AnswersControler()