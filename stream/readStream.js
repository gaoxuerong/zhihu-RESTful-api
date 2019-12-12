const eventEmitter = require('events');
const fs = require('fs')
class ReadStream extends eventEmitter {
    constructor(path, options = {}) {
        super()
        this.path = path;
        this.flags = options.flags;
        this.highWaterMark = options.highWaterMark || 64*1024
        this.start = options.start || 0
        this.end = options.end || null
        this.encoding = options.encoding || null
        // 默认情况下是非流动模式，如果监听了on(data)就变成流动模式
        this.flowing = null
        // 读取文件的位置
        this.pos = this.start // this.pos会变
        // 判断用户监听了哪些事件
        this.on('newListener', function(type) {
            if(type === 'data') {
                this.flowing = true
                this.open() // 先打开
                this.read() // 开始读取
            }
        })
    }
    open() {
        fs.open(this.path,this.flags,(err,fd) => {
            if (err) {
                this.emit('error',err)
            }
            this.fd = fd // 把文件描述符存好
            this.emit('open',fd)
        })
    }
    read() {
        if(typeof this.fd !== 'number') {
            this.once('open', () => this.read())
        }
        const buffer = Buffer.alloc(this.highWaterMark)
        const howMuchToRead = this.end ? Math.min(this.highWaterMark,(this.end - this.pos + 1)) : this.highWaterMark
        fs.read(this.fd, buffer, 0, howMuchToRead,this.pos,(err, byteRead)=> {
            this.pos += byteRead
        } )
    }
}
module.exports = ReadStream;
