import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3002,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
        '/api': {
            target: 'http://192.168.31.65:1234/',// node服务
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
        },
        '/javaapi': {
            target: 'http://localhost:9999/',// node服务
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/javaapi/, '') // 不可以省略rewrite
        }
    }
  },
  base:'./',
  build:{
    outDir:path.resolve(__dirname,'../../../dist/vue3'),
    emptyOutDir:false,
    rollupOptions:{
      output:{
        manualChunks(id){
          if(id.includes('node_modules')){
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  resolve:{
    alias: {
        '@': path.resolve(__dirname, './src')
    }
  }
})
