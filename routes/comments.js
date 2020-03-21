const Router = require("koa-router")
const JWT = require('koa-jwt')
const router = new Router({prefix: '/questions/:questionId/answers/:answerId/comments'})
const {
  find,
  findById,
  create,
  update,
  delete: del,
  checkCommentExist,
  checkCommenter
} = require('../controllers/comments')
const { secret } = require('../config')
const auth = JWT({ secret })
router.get("/", find)
router.post("/", auth, create)
router.get("/:id", checkCommentExist, findById)
router.patch("/:id", auth, checkCommentExist, checkCommenter, update)
router.delete("/:id", auth, checkCommentExist, checkCommenter, del)
module.exports = router