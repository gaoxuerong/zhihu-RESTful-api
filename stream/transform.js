const { Transform } = require('stream')
class MyStream extends Transform {
    _transform(chunk,encoding,callback) {
        this.push(chunk.toString().toUpperCase())
        callback()
    }
}
const myStream = new MyStream()
process.stdin.pipe(myStream).pipe(process.stdout)
