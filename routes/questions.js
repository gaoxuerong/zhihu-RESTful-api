const Router = require("@koa/router");
const JWT = require("koa-jwt");
const router = new Router({ prefix: "/questions" });
const {
  find,
  findById,
  create,
  update,
  delete: del,
  checkQuestionExist,
  checkQuestioner,
} = require("../controllers/questions");
const { secret } = require("../config");
const auth = JWT({ secret });
router.get("/", find);
router.post("/", auth, create);
router.get("/:id", checkQuestionExist, findById);
router.patch("/:id", auth, checkQuestionExist, checkQuestioner, update);
router.delete("/:id", auth, checkQuestionExist, checkQuestioner, del);
module.exports = router;
