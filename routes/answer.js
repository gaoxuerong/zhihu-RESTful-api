const Router = require("@koa/router")
const JWT = require('koa-jwt')
const router = new Router({prefix: '/questions/:questionId/answers'})
const {
  find,
  findById,
  create,
  update,
  delete: del,
  checkAnswerExist,
  checkAnswerer
} = require('../controllers/answers')
const { secret } = require('../config')
const auth = JWT({ secret })
router.get("/", find)
// router.post("/", auth, create)
// router.get("/:id", checkAnswerExist, findById)
// router.patch("/:id", auth, checkAnswerExist, checkAnswerer, update)
// router.delete("/:id", auth, checkAnswerExist, checkAnswerer, del)
module.exports = router

