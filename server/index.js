const http = require('http')
const fs = require('fs')
const { type } = require('os')
var data=fs.readFileSync('./server/login.json','utf-8');//所有用户列表


const server = http.createServer()
server.on('request',function(req,res){
    
    //请求登录地址时，返回是否登录成功
    if(req.url=='/login'){
        let reqParams;
        let loginBoolean;
        //请求参数传递时触发data事件
        req.on('data',(params)=>{
            console.log('data')
            reqParams=JSON.parse(params)
        })
        //请求参数传递结束时触发end事件
        req.on('end',()=>{
            console.log('end')
            judgeIsLogin(reqParams)?loginBoolean=true:loginBoolean=false;
            res.write(JSON.stringify({
                success:loginBoolean?1:0
            }))
            res.end()
        })
    }
})
server.listen(80,function(){
    console.log('运行端口：80')
})

function judgeIsLogin(userObj){
    let uselist=JSON.parse(data)
    return uselist.find(el=>el.username==userObj.username&&el.password==userObj.password)
}