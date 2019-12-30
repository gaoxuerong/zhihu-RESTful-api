const Router = require("koa-router")
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
  listFollowers,
  checkUserExist
} = require('../controllers/users')
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
module.exports = router

