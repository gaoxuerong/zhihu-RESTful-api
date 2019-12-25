const fs = require('fs')
// rs 就是可读流创建出来的对象
const rs = fs.createReadStream('./index.md', {
    flags: 'r',
    encoding: null,
    // 读2 写4 执行1
    mode: 0o666,
    start: 0,
    end: 100,
    autoClose: true, //读完自动关闭
    highWaterMark: 3 // 每次读取64k内容；
})
// 默认情况下非流动模式，如果监听了on（data）就会变成流动模式，不停的读取文件，直到读完，然后触发on(end)事件，
rs.on('data', function(data) {
    console.log(data)
    // rs.pause() // 让当前的on(data)事件暂停触发，只触发一次
})
// setTimeout(() => {
//     rs.resume() // 恢复触发on(data)事件
// },1000)
rs.on('end', function(data) {
    console.log(`读取完毕`)
})
// 文件
rs.on('open', function() {
    console.log(`文件被打开了`)
})
rs.on('close', function() {
    console.log(`文件被关闭了`)
})
rs.on('error', function() {
    console.log(`文件出错了`)
})