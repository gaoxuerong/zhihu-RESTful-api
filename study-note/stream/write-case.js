const writeStream = require('./writeStream')
const ws = new writeStream('1.txt', {
  highWaterMark: 3
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