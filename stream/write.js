const { Writable } = require('stream')
// 自定义的可写流
class MyWrite extends Writable {
    _write(chunk,encoding,clearBuffer) {
        console.log(chunk.toString())
    }
}
const myWrite = new MyWrite()
myWrite.write('123', 'utf8', () => {
    console.log('mywrite1')
})
myWrite.write('456', 'utf8', () => {
    console.log('mywrite2')
})
