var { createServer } = require('http')
var {Server} = require('socket.io')
const fs = require('fs')
const url = require('url')
const Login = require('./login')
const indexHtml = fs.readFileSync(require.resolve('./index.html'),{encoding:'utf8'})
var http = createServer((req,res)=>{
    const pathname = url.parse(req.url).pathname
    res.writeHead(200,{'content-type':'text/html;charset=UTF8'})
    switch(pathname){
        case '/login':
            Login(req,res)
        break;
        default:
            res.end(indexHtml)
        break;
    }
})
var io = new Server(http,{
  cors:{
    origin:'*',
    methods:['get','post']
  }
})
io.on('connection',(socket)=>{
  console.log('连接');
  socket.on('send-message',(data)=>{
    console.log('客户端发送',data);
    socket.emit('message',data)
    socket.broadcast.emit('msg_res',data)
  })
})
http.listen(1234,()=>{
  console.log('http://localhost:1234')
})




// var app = http.createServer(handler)
// const { log } = require('console')

// var fs = require('fs')

// app.listen(1234,()=>{
//   log('端口：1234')
// })
// function handler(req,res){
//   fs.readFile(__dirname+'/index.html',(err,data)=>{
//     if(err){
//       res.writeHead(500)
//       return res.end('Error loading index.html')
//     }
//     res.writeHead(200)
//     res.end(data)
//   })
// }
// io.on('connection',(socket)=>{
//   log('连接')
//   socket.on('sendMsg',function(data){
//     socket.emit('newMsg',data)
//     socket.broadcast.emit('msg_res',data)
//   })
// })