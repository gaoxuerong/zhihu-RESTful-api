const Router = require("koa-router");
const router = new Router({prefix: '/users'});
// delete是js关键字，不能直接使用
const { find, findById, created, update, delete:del } = require('../controllers/users')
router.get("/", find);
router.post("/", created);
router.get("/:id", findById);
router.put("/:id", update);
router.delete("/:id", del);
module.exports = router

