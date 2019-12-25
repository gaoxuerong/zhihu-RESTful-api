const eventEmitter = require("events");
const fs = require('fs')
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
    // 标示用户是否正在写入
    this.writing = false
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
  write(chunk, encoding = this.encoding, callback) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    this.len += chunk.length
    const flags = this.len >= this.highWaterMark
    if (flags) { // 已经超过预期了，触发drain事件
      this.needDrain = true
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
      // 当第一个写入成功后，调用此回调函数，清空数组中的方法
      this._write(chunk, encoding,() => this.clearBuffer())
    }
    return !flags
  }
  _write(chunk, encoding, callback) {
    if(typeof this.fd !== 'number') {
      return this.once('open',() => this._write(chunk, encoding, callback))
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
      // written就是当前写入的个数，每次写入完成后，需要将缓存区减少
      this.len -= written
      this.pos += written
      callback() //清空数组下一项
    })
  }
  clearBuffer() {
    const obj = this.cache.shift()
    if (obj) {
      this._write(obj.chunk, obj.encoding, () => this.clearBuffer())
    } else {
      if (this.needDrain) {
        this.writing = false // 缓存区干了，下一次写入到文件里，而不是内存里
        this.needDrain = false
        this.emit('drain')
      }

    }
  }
}

module.exports = WriteStream