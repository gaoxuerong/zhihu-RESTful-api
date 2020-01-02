const Router = require("koa-router")
const JWT = require('koa-jwt')
const router = new Router({prefix: '/topics'})
const {
  find,
  findById,
  create,
  update,
} = require('../controllers/topics')
const { secret } = require('../config')
const auth = JWT({ secret })
router.get("/", find)
router.post("/", auth, create)
router.get("/:id", findById)
router.patch("/:id", auth, update)
module.exports = router

