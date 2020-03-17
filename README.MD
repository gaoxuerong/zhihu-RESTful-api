- http options作用：
  - 检测服务器所支持的请求方法；
  - CORS中的预检请求
- allowedMethods作用：
  - 响应options方法，通过Allow字段告诉他所支持的请求方法
  - 相应的返回405（不允许）和501（没实现）；比如url只是实现了get方法，但是没实现post方法，用post方法访问该接口就返回405；但是用LINK方法就会返回501，因为koa这个框架不支持LINK这个
生僻方法；
- mongodb
  - 性能好（内存计算）
  - 方便存储复杂数据结构
  - 大规模数据存储
- session 是非常流行的用户认证与授权的方式
  - session优势：1.服务端可以主动清除session； 2.session保存在server端，相对比较安全；3.结合cookie使用，灵活，兼容性好
  - session劣势：1.跨域场景表现不好；2.如果是分布式部署，需要做多机共享session机制；3.基于cookie的机制很容易被CSRF；4.查询session信息可能会有数据库查询操作；
  - 扩展： sessionStorage 仅在当前会话下有效，关闭页面或者浏览器后，数据会被清除；
- JWT [json web token 是一个开放标准 (RFC 7519)] 三部分构成;写成一行就是：Header.Payload.Signature
  - Header (头部)
    - Header部分是一个json对象，描述JWT的元数据，
    ```
    {
      "alg": "SHA256",
      "typ": "JWT"
    }
    最后，将上面的 JSON 对象使用 Base64URL 算法转成字符串。
    ```
  - Payload (载)
    ```
    Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据;
    注意，JWT 默认是不加密的
    ```
  - Signature (签名)
    - Signature 部分是对前两部分的签名，防止数据篡改;首先，需要指定一个密钥。这个密钥只有服务器才知道。然后，使用 Header 里面指定的签名算法按照下面的公式产生签名,例如
    `HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secret)`
- JWT缺点： JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。
- koa-bodyparser 只支持json/form，不支持文件这种方式；koa-body不仅支持json/form，还支持文件上传
- 服务器：安装git、nodejs、nginx
  - SSH登录到服务器
  - 安装git，拉服务端代码；
  - 安装nodejs；
  - 在服务器安装pm2(pm2有很多功能，具体查看文档)
    - pm2 log app  查看日志
    - pm2 reload app  重新加载
    - pm2 restart app 重启
  - 安装nginx，做接口转发，把外网80端口转换到内网3000端口
  ```
    server {
      listen 80;
      server_name localhost;
      location / {
        proxy_pass http://127.0.0.1:3000;
      }
    }
  ```
- 学习拓展建议
  - 学习 egg.js
  - 学习多进程知识
  - 学习使用日志和性能监控


