const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    lintOnSave:false,
  transpileDependencies: true,
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
