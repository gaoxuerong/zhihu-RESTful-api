const path = require("path");
class HomeControler {
  index(ctx) {
    ctx.body = "<h1>jbnjgfnbfgjnjfgn</h1>";
  }
  upload(ctx) {
    const file = ctx.request.files.file;
    const basename = path.basename(file.path);
    ctx.body = {
      url: `${ctx.origin}/uploads/${basename}`,
    };
  }
}
module.exports = new HomeControler();
