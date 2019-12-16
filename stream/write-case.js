const fs = require('fs')
const writeStream = require('./writeStream')
const ws = fs.createWriteStream('1.txt', {
  highWaterMark: 16*1024
})
let i = 0
function write() {
  let flag = true
  while(i < 9 && flag) {
    flag = ws.write(i++ + '')
  }
}
write()
ws.on('drain',() => {
  console.log(`干了`)
  write()
})
ws.write('你')
ws.write('好')