const { defineConfig } = require('@vue/cli-service')
const path = require("path");
function resolve(dir){
    return path.join(__dirname,dir)
}

module.exports = defineConfig({
    lintOnSave:false,
  transpileDependencies: true,
  chainWebpack:config=>{
    config.resolve.alias
    .set('@',resolve('src'))
    .set('api',resolve("src/api"))
    .set('styles',resolve("src/styles"))
    .set('views',resolve('src/views'))

  },
  devServer:{
    hot:true,
    open:true,
    port:8080,
    host:'localhost'
  },
  pluginOptions:{
    'style-resources-loader':{
      perProcessor:'scss',
      patterns:[]
    }
  }
})
