const http = require('http')
const url = require('url')
const path = require('path')
const zlib = require('zlib')
// const { promisify } = require('util') // 结果为promise
// 第三方模块
const fs = require('mz/fs')
const mime = require('mime')
const ejs = require('ejs')
const chalk = require('chalk')
const debug = require('debug')('dev')
const { readFileSync } = require('fs')
const tmpl = readFileSync(path.join(__dirname, 'template.html'),'utf8')
class Server {
  constructor(config) {
    this.config = config
    this.tmpl = tmpl
  }
  async handleRequest(req, res) {
    const { dir } = this.config
    const { pathname } = url.parse(req.url)
    const realPath = decodeURIComponent(path.join(dir, pathname))
    try {
      const statObj = await fs.stat(realPath)
      if (statObj.isDirectory()) {
        const html = path.join(realPath, 'index.html')
        try {
          await fs.access(html)
          this.sendFile(req, res, null, html)
        } catch (error) {
          const dirs = await fs.readdir(realPath)
          const renderStr = ejs.render(this.tmpl, {
            data: {
              dirs:  dirs.map((item) => ({
                name: item,
                path: path.join(pathname, item)
              }))
            }
          })
          res.setHeader('Content-Type','text/html;charset=utf8')
          res.end(renderStr)
        }
      } else {
        // 如果是文件
        this.sendFile(req, res, statObj, realPath)
      }
    } catch (error) {
      this.sendError(req, res, error)
    }
  }
  sendFile(req, res, statObj, realPath) {
    // 压缩
    // 304 缓存
    // 206 范围请求
    res.setHeader('Content-Type', mime.getType(realPath) + ';charset=utf8')
    let gzip
    if (gzip = this.gzip(req, res)) {
      fs.createReadStream(realPath).pipe(gzip).pipe(res)
      return
    }
    fs.createReadStream(realPath).pipe(res)
  }
  gzip(req, res) {
    const gzip = req.headers['accept-encoding']
    if (gzip) {
      // 返回一个压缩流，转化流
      if (gzip.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding','gzip')
        return zlib.createGzip()
      } else if (gzip.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding','deflate')
        return zlib.createDeflate()
      }
    } else {
      return false
    }
  }
  sendError(req, res,error) {
    debug(JSON.stringify(error))
    res.statusCode = 404
    res.end(`not found`)
  }
  start() {
    const server = http.createServer(this.handleRequest.bind(this))
    const { port, host } = this.config
    server.listen(port,  host, function() {
      debug(`http://${host}:${chalk.green(port)} start`)
    })
  }
}
module.exports = Server