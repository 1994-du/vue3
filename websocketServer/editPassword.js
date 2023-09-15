// 修改账号密码和用户名
const { log } = require('console');
const fs = require('fs')
var usersData = JSON.parse(fs.readFileSync(require.resolve('./data/login.json'),{encoding:'utf8'}));//所有用户列表
const EditPassWord = function(req,res){
    req.on('data',(data)=>{
        res.end(JSON.stringify({
            msg:'修改成功!',
            status:'success'
        }))
    })
}
module.exports=EditPassWord