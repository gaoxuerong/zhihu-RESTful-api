const fs = require('fs')
const ws = fs.createWriteStream('1.txt', {
    flags: 'w',
    encoding: 'utf8',
    autoClose: true,
    highWaterMark: 2 // 默认16*1024 ；不是每次能写16k，预计我用16k来写
})
// flag是个布尔值，是否等于或者超过预期
const flag = ws.write('1', 'utf8',() => {
    console.log(`write ok`)
})
console.log(flag)