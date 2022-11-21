const { defineConfig } = require('@vue/cli-service')
const path = require('path')
function resolve(dir){
  return path.join(__dirname,dir)
}
module.exports = defineConfig({
  productionSourceMap:false,
  transpileDependencies: true,
  // chainWebpack:config=>{
  //   config.resolve.alias.set('@',resolve("src"))
  // },
  devServer:{
    host:'localhost',
    port:'8080'
  }
})
