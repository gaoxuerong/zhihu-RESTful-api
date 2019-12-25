const { Duplex } = require('stream')
class MyStream extends Duplex {
    _write(chunk, encoding, clearBuffer) {
        console.log(chunk)
        clearBuffer()
    }
    _read() {
        this.push('123')
        this.push(null)
    }
}
const myStream = new MyStream()
myStream.on('data',function(data) {
    console.log(data)
})
myStream.write('rrrr----rrrr')
// 双工流中write和read没关系
// http中req可读流，res可写流