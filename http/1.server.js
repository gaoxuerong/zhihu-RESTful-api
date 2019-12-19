const http = require('http')
http.createServer(function(req,res){
    console.log(req.method)
}).listen('3000','localhost',function(){
    console.log('`3000端口启动了')
})