const Router = require("koa-router")
const JWT = require('koa-jwt')
const router = new Router({prefix: '/topics'})
const {
  find,
  findById,
  create,
  update,
  checkTopicExist,
  listTopicFollowers,
  listQuestions
} = require('../controllers/topics')
const { secret } = require('../config')
const auth = JWT({ secret })
router.get("/", find)
router.post("/", auth, create)
router.get("/:id", checkTopicExist, findById)
router.patch("/:id", auth, checkTopicExist,update)
router.get("/:id/followers", checkTopicExist, listTopicFollowers)
router.get("/:id/questions", checkTopicExist, listQuestions)
module.exports = router

