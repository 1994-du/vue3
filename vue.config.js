const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath:"./",
  productionSourceMap:false,
  transpileDependencies: true,
  devServer:{
    host:'0.0.0.0',
    port:'8080',
    historyApiFallback:true,
    allowedHosts:'all'
  },
  configureWebpack:(config)=>{
    config['performance']={
      maxEntrypointSize:100000000,
      maxAssetSize:10000000,
      assetFilter:function(assetFilename){
        return assetFilename.endsWith('.js')
      }
    }
  }
})
