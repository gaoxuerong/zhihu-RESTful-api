const http = require('http')
const fs = require('fs')
const path = require('path')
http.createServer(function(req, res){
    let arr = []
    req.on('data',function(data) {
        arr.push(data)
    })
    if (req.url === '/ajax.html') {
        console.log(path.resolve(__dirname)) // /Users/xueronggao/Desktop/zhihu-restful-api/http
        return fs.createReadStream(path.resolve(__dirname,'ajax.html')).pipe(res)
    }
    if (req.url === '/login') {
        req.on('end', function(){
            const str = Buffer.concat(arr).toString()
            const obj = require('querystring').parse(str)
            res.end(JSON.stringify(obj))
            // const reg = /([^=&]*)=([^=&]*)/g
            // const obj = {}
            // str.replace(reg, function() {
            //     console.log(arguments)
            //     obj[arguments[1]] = arguments[2]
            // })
            // res.end(obj.toString())
        })
    }
}).listen('3000','localhost',function(){
    console.log('3000端口启动了')
})