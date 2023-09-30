//上传头像、文件等保存至data文件夹中
const fs = require('fs')
const Upload = function(req,res){
    req.on('data',(data)=>{
        console.log('data--',data);
        fs.writeFile('./data/images/'+Date.now()+'.png',data,(err)=>{
            if(err){
                console.log('err',err);
            }
            else{
                res.end(JSON.stringify({
                    msg:"注册成功！",
                    status:'success'
                }))
            }
        })
    })
}
// export default Upload
module.exports = Upload