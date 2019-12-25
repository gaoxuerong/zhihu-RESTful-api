const fs = require('fs')
const ws = fs.createWriteStream('1.txt', {
    flags: 'w',
    encoding: 'utf8',
    autoClose: true,
    highWaterMark: 4 // 默认16*1024 ；不是每次能写16k，预计我用16k来写
})
// flag是个布尔值，是否等于或者超过预期
// flag并不能代表文件是否写入成功，flag为false也可以写入成功
const flag = ws.write('1', 'utf8',() => {
    console.log(`write ok`)
})
ws.write('1', 'utf8',() => {
    console.log(`write ok`)
})
ws.write('456', 'utf8',() => {
    console.log(`write ok`)
})
// 虽然是异步，但是写入的顺序并不会乱，内部会对写的过程进行排队
// 第一次是真的写入，除了第一次的都暂存起来
console.log(flag)
ws.on('drain',() => {
    console.log(`干了`)
})
