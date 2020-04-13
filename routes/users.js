const Router = require("@koa/router")
const JWT = require('koa-jwt')
const router = new Router({prefix: '/users'})
// delete是js关键字，不能直接使用
const {
  find,
  findById,
  created,
  update,
  delete:del,
  login,
  checkOwner,
  listFollowing,
  follow,
  unfollow,
  listFollowingTopics,
  followTopics,
  unfollowTopics,
  listFollowers,
  checkUserExist,
  listQuestions,
  listLikingAnswers,
  likeAnswers,
  unlikegAnswers,
  listdisLikingAnswers,
  dislikeAnswers,
  undislikegAnswers,
  listCollectionAnswers,
  collectAnswers,
  uncollectAnswers
} = require('../controllers/users')
const {
  checkTopicExist
} = require('../controllers/topics')
const {
  checkAnswerExist
} = require('../controllers/answers')
const { secret } = require('../config')
// const auth = async (ctx, next) => { // 安全相关中间件
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jwt.verify(token, secret)
//     ctx.state.user = user
//   } catch (error) {
//     ctx.throw(401, error.massege)
//   }
//   await next()
// }
const auth = JWT({ secret })
router.get("/", find)
router.post("/", created)
router.get("/:id", findById)
router.patch("/:id", auth, checkOwner, update)
router.delete("/:id", auth, checkOwner, del)
router.post('/login', login)
router.get('/:id/following', listFollowing)
router.get('/:id/listFollowers', listFollowers)
router.put('/following/:id',auth, checkUserExist, follow);
router.delete('/following/:id',auth, checkUserExist, unfollow);
router.get('/:id/followingTopics', listFollowingTopics)
router.put('/followingTopics/:id',auth, checkTopicExist, followTopics);
router.delete('/followingTopics/:id',auth, checkTopicExist, unfollowTopics);
router.get('/:id/questions', listQuestions)
router.get('/:id/listLikingAnswers', listLikingAnswers)
router.put('/likeAnswers/:id',auth, checkAnswerExist, likeAnswers,undislikegAnswers);// 点击喜欢后，就把不喜欢的delete掉, 互斥关系
router.delete('/likeAnswers/:id',auth, checkAnswerExist, unlikegAnswers);
router.get('/:id/listdisLikingAnswers', listdisLikingAnswers)
router.put('/dislikeAnswers/:id',auth, checkAnswerExist, dislikeAnswers,unlikegAnswers);// 点击不喜欢后，就把喜欢的delete掉, 互斥关系
router.delete('/dislikeAnswers/:id',auth, checkAnswerExist, undislikegAnswers);
router.get('/:id/listCollectionAnswers', listCollectionAnswers)
router.put('/collectAnswers/:id',auth, checkAnswerExist, collectAnswers);
router.delete('/collectAnswers/:id',auth, checkAnswerExist, uncollectAnswers);
module.exports = router

