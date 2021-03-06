const eventEmitter = require("events");
const fs = require("fs");
class ReadStream extends eventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || 'r';
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.start = options.start || 0;
    this.end = options.end || null;
    this.encoding = options.encoding || null;
    // 默认情况下是非流动模式，如果监听了on(data)就变成流动模式
    this.flowing = null;
    // 读取文件的位置
    this.pos = this.start; // this.pos会变
    // 判断用户监听了哪些事件
    this.on("newListener", function(type) {
      if (type === "data") {
        this.flowing = true;
        this.open(); // 先打开
        this.read(); // 开始读取
      }
    });
  }
  resume() {
    this.flowing = true
    this.read() // 变成流动模式
  }
  pause() {
    this.flowing = false
  }
  pipe(ws) {
    this.on('data', (data) => {
      const flag = ws.write(data)
      if (!flag) {
        this.pause()
      }
    })
    ws.on('drain', () => {
      console.log('drain')
      this.resume()
    })
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        console.log(err);
        this.emit("error", err);
      }
      this.fd = fd; // 把文件描述符存好
      this.emit("open", fd);
    });
  }
  read() {
    if (typeof this.fd !== "number") {
      return this.once("open", () => this.read());
    }
    const buffer = Buffer.alloc(this.highWaterMark);
    const howMuchToRead = this.end
      ? Math.min(this.highWaterMark, this.end - this.pos + 1)
      : this.highWaterMark;
    if (howMuchToRead == 0) {
      this.flowing = null;
      this.emit("end");
      return this.close();
    }
    fs.read(this.fd, buffer, 0, howMuchToRead, this.pos, (err, byteRead) => {
      this.pos += byteRead;
      if (byteRead > 0) {
        this.emit("data", buffer.slice(0, byteRead));
        if (this.flowing) { // 如果是流动模式就接着读
          this.read();
        }
      }
    });
  }
  close() {
    fs.close(this.fd, () => {
      this.emit('close')
    })
  }
}
module.exports = ReadStream;
