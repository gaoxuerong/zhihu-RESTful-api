const http = require('http')
http.createServer(function(req,res){
    console.log(req.headers)
    // 请求头都是小写的，请求方法都是大写的
    let arr = []
    // 如果有请求体会触发on(data),如果没有请求体会触发on（'end'）
    req.on('data',function(data) {
        arr.push(data)
    })
    req.on('end',function() {
        console.log(Buffer.concat(arr).toString())
        res.end('server say hello')
    })
}).listen('3000','localhost',function(){
    console.log('3000端口启动了')
})