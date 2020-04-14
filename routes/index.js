const fs = require("fs");
module.exports = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === "index.js") {
      return;
    }
    const route = require(`./${file}`);
    app.use(route.routes()).use(route.allowedMethods()); // 响应options方法，告诉他所支持的请求方法
  });
};
