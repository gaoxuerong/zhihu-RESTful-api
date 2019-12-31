const Router = require("koa-router")
const JWT = require('koa-jwt')
const router = new Router({prefix: '/users'})
const {
  find,
  findById,
  created,
  update,
} = require('../controllers/users')
const { secret } = require('../config')
const auth = JWT({ secret })
router.get("/", find)
router.post("/", auth, created)
router.get("/:id", findById)
router.patch("/:id", auth, update)
module.exports = router

