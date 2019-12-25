// const fs = require('fs')
// const rs = fs.createReadStream('1.txt')
// const ws = fs.createWriteStream('2.txt')
// // 边读边写，不会淹没可用内存
// rs.pipe(ws)

//测试
const writeStream = require('./writeStream')
const ReadStream = require('./readStream')
const rs = new ReadStream('1.txt', { highWaterMark: 4 })
const ws = new writeStream('2.txt', { highWaterMark: 1 })
rs.pipe(ws)


