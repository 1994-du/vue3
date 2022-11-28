const http = require('http')
const fs = require('fs')
var data=fs.readFileSync('./server/login.json','utf-8')
console.log(JSON.parse(data))
const server = http.createServer()
server.on('request',function(req,res){
        res.write(data)
        res.end()
})
server.listen(80,function(){
    console.log('运行端口：80')
})