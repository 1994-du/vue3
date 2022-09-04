const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // chainWebpack:config=>{
  //   config.resolve.alias.set('@',resolve("src"))
  // }
  devServer:{
    host:'localhost',
    port:'8080'
  }
})
