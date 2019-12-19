const http = require('http')
const client = http.request({
    host: 'localhost',
    method: 'post',
    port: 3000,
    path: '/user',
    headers: {
        name: 'gxr',

    }
},() => {

})
client.end('age=9')