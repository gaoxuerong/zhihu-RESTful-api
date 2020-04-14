const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const { secret } = require("../config");
class UsersControler {
  // 查找用户列表
  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) }) // 里边的内容是用正则表达式做的模糊搜索
      .limit(perPage)
      .skip(page * perPage); // limit,skip做分页限制，limit(10)是每页显示10条，skip(10)是跳过前10项，
  }
  // 查找特定用户
  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const populateStr = fields
      .split(";")
      .filter((f) => f)
      .map((f) => {
        if (f === "employments") {
          return "employments.company employments.job";
        }
        if (f === "educations") {
          return "educations.school educations.major";
        }
        return f;
      })
      .join(" ");
    const user = await User.findById(ctx.params.id)
      .select(selectFields)
      .populate(populateStr); // 用户属性中的话题引用
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }
  // 增加用户
  async created(ctx) {
    ctx.verifyParams({
      name: {
        type: "string",
        required: true,
      },
      password: {
        type: "string",
        required: true,
      },
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) {
      ctx.throw(409, "用户已经存在");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  // 检查用户是否有权限
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }
  // 更新用户
  async update(ctx) {
    ctx.verifyParams({
      name: {
        type: "string",
        required: false,
      },
      password: {
        type: "string",
        required: false,
      },
      avatar_url: {
        type: "string",
        required: false,
      },
      gender: {
        type: "string",
        required: false,
      },
      headline: {
        type: "string",
        required: false,
      },
      locations: {
        type: "array",
        itemType: "string",
        required: false,
      },
      business: {
        type: "string",
        required: false,
      },
      employments: {
        type: "array",
        itemType: "object",
        required: false,
      },
      educations: {
        type: "array",
        itemType: "object",
        required: false,
      },
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }
  // 删除用户
  async delete(ctx) {
    // 没有内容但是成功了，https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/204
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.status = 204;
  }
  // 用户登录
  async login(ctx) {
    ctx.verifyParams({
      name: {
        type: "string",
        required: true,
      },
      password: {
        type: "string",
        required: true,
      },
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, "用户名或者密码不正确");
    }
    const { _id, name } = user;
    const token = jwt.sign({ _id, name }, secret, { expiresIn: "1d" });
    ctx.body = { token };
  }
  // 获取用户关注的列表
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+following")
      .populate("following");
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user.following;
  }
  // 获取用户的粉丝数
  async listFollowers(ctx) {
    const users = await User.find({ following: ctx.params.id }); // 找到关注ctx.params.id的人
    ctx.body = users;
  }
  // 检查用户是否存在
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    await next();
  }
  // 用户关注某人
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    if (!me.following.map((id) => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }
  // 用户取消关注某人
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    const index = me.following
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 获取用户关注的话题列表
  async listFollowingTopics(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+followingTopics")
      .populate("followingTopics");
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user.followingTopics;
  }
  // 关注话题
  async followTopics(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+followingTopics"
    );
    if (
      !me.followingTopics.map((id) => id.toString()).includes(ctx.params.id)
    ) {
      me.followingTopics.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }
  // 取消关注话题
  async unfollowTopics(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+followingTopics"
    );
    const index = me.followingTopics
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 用户点赞列表
  async listLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+collectingAnswers")
      .populate("likingAnswers");
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user.likingAnswers;
  }
  // 用户点赞
  async likeAnswers(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select("+likingAnswers");
    if (!me.likingAnswers.map((id) => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } });
    }
    ctx.status = 204;
    await next();
  }
  // 用户取消点赞
  async unlikegAnswers(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+likingAnswers");
    const index = me.likingAnswers
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, {
        $inc: { voteCount: -1 },
      });
    }
    ctx.status = 204;
  }
  // 用户踩列表
  async listdisLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+dislikingAnswers")
      .populate("dislikingAnswers");
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user.dislikingAnswers;
  }
  // 用户踩
  async dislikeAnswers(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select(
      "+dislikingAnswers"
    );
    if (
      !me.dislikingAnswers.map((id) => id.toString()).includes(ctx.params.id)
    ) {
      me.dislikingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  // 用户取消踩
  async undislikegAnswers(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+dislikingAnswers"
    );
    const index = me.dislikingAnswers
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  // 获取用户问题列表
  async listQuestions(ctx) {
    const questions = await Question.find({ questioner: ctx.params.id });
    ctx.body = questions;
  }
  // 用户收藏列表
  async listCollectionAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+collectingAnswers")
      .populate("collectingAnswers");
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user.collectingAnswers;
  }
  // 收藏
  async collectAnswers(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select(
      "+collectingAnswers"
    );
    if (
      !me.collectingAnswers.map((id) => id.toString()).includes(ctx.params.id)
    ) {
      me.collectingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  // 取消收藏
  async uncollectAnswers(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+collectingAnswers"
    );
    const index = me.collectingAnswers
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.collectingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}
module.exports = new UsersControler();
