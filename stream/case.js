const ReadStream = require('./readStream')
const rs = new ReadStream('./index.md', {
  flags: 'r',
  encoding: null,
  start: 0,
  end: 6,
  autoClose: true, //读完自动关闭
  highWaterMark: 3 // 每次读取64k内容；
})
// on off emit once newListener
rs.on('data', function(data) {
  console.log(data)
})
rs.on('end', function(data) {
  console.log(`end`)
})
rs.on('close', function(data) {
  console.log(`close`)
})
rs.on('error', function(err) {
  console.log(err+'err')
})