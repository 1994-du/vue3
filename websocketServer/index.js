var { createServer } = require('http')
var express = require('express')
var {Server} = require('socket.io')
const fs = require('fs')
const url = require('url')
const Login = require('./login') // 登录
const Registry = require('./registry') //注册
const Upload = require('./upload')//上传
const indexHtml = fs.readFileSync(require.resolve('./index.html'),{encoding:'utf8'})
var app = express()
app.all('/',(req,res)=>{
  res.end(indexHtml)
})
app.all('/login',(req,res)=>Login(req,res))
app.all('/registry',(req,res)=>Registry(req,res))
app.all('/upload',(req,res)=>Upload(req,res))
var http = createServer(app)
var io = new Server(http,{
  cors:{
    origin:'*',
    methods:['get','post']
  }
})
io.on('connection',(socket)=>{
  socket.on('send-message',(data)=>{
    socket.broadcast.emit('msg_res',data)
  })
})
http.listen(1234,()=>{
  console.log('http://localhost:1234')
})