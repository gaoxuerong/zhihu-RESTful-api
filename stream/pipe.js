const fs = require('fs')
const rs = fs.createReadStream('1.txt')
const ws = fs.createWriteStream('2.txt')
rs.pipe(ws)

