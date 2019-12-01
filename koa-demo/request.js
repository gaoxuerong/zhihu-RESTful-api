const url = require("url");
module.exports = {
  // 访问器的写法
  get url() {
    return this.req.url;
  },
  get path() {
    const { pathname } = url.parse(this.req.url, true);
    return pathname;
  }
};
