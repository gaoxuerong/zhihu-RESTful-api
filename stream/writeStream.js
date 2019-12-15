const eventEmitter = require("events");
class WriteStream extends eventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || 'w';
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.autoClose = options.autoClose || true;
    this.encoding = options.encoding || 'utf-8';
    this.start = options.start || 0;
    // 如果多次调用write方法，将其放到缓存中
    this.cache = []
    // 当前是否需要触发这个drain事件
    this.needDrain = false
    this.len = 0
    // 维护一个写入的位置
    this.pos = this.start
    // 打开文件 等待用户调用write方法
    this.open()
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        return this.emit("error", err);
      }
      this.fd = fd;
      this.emit("open", fd);
    });
  }
  write() {
    if(typeof this.fd !== 'number') {
      return this.once('open',() => this.write())
    }
    // 用户调用write方法，第一次是真的写，其他的都要存起来
    if (this.writing) {
      this.cache.push({
        chunk,
        encoding,
        callback
      })
    } else {
      this.writing = true
      this._write()
    }
  }
}