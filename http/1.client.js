const http = require('http')
const client = http.request({
    host: 'localhost',
    method: 'post',
    port: 3000,
    path: '/user',
    headers: {
        name: 'gxr',

    }
},(res) => {
    res.on('data',function(data) {
        console.log(data.toString())
    })
})
// 请求体
client.end('age=9')