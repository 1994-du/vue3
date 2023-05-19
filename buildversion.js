const version = process.env.npm_config_buildv
const fs = require('fs')
const path = require('path')
const url = path.join(process.cwd(),'./package.json')
const package = fs.readFileSync(url,'utf-8')

const {exec}=require('child_process')
try{
    const json = JSON.parse(package)
    json.version=version
    
    fs.writeFileSync(url,JSON.stringify(json,null,2))
    const build = exec('npm run build')
    build.stdout.on('data',(chunk)=>{
        console.log(chunk)
    })
}
catch(e){
    throw('.error()')
}