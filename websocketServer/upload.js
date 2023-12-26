//上传头像、文件等保存至data文件夹中
const fs = require('fs')
const multiparty = require('multiparty')
const path = require('path')
const Upload = function(req,res){
    res.writeHead(200,{'content-type':'text/html;charset=UTF8'})
    let form = new multiparty.Form()
    form.parse(req)
    form.on('part',(part)=>{
        let fileName = 'custom_'+part.filename
        const dest = fs.createWriteStream('./data/images/' + fileName);
        part.pipe(dest);
        dest.on('finish', () => {
            let pth = path.join(__dirname,'./data/images/')
            let filepth = path.join(pth,fileName)
            res.end(JSON.stringify({
                status:'success',
                msg:'上传成功！',
                url:filepth
            }))
        });
        dest.on('error',(error)=>{
            console.log('err',error);
        })
    })
    form.on('error',(err)=>{
        console.log('formerr',err);
    })
}
module.exports = Upload