const { Readable } = require('stream')
// 自定义的可读流
class MyRead extends Readable {
    constructor() {
        super()
        this.index = 0
    }
    _read() {
        if (this.index === 9) {
            this.push(null)
        } else {
            this.index++
            this.push(`aaa`)
        }
    }
}
const myRead = new MyRead()
myRead.on('data', (data) => {
    console.log(data)
})
// push(null)触发end事件
myRead.on('end', (data) => {
    console.log('end')
})
