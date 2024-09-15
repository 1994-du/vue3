import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import alias from "@rollup/plugin-alias"
export default defineConfig({
  publicDir:'./public',
  plugins: [
    alias(),
    vue(),
  ],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'./src')
    }
  },
  test: {
    environment:'jsdom'
  },
  server: {
    port: '3000',
    proxy: {
      '/api': {
        target: 'http://localhost:1234/',// node服务
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
      },
      '/javaapi': {
        target: 'http://localhost:9999/',// node服务
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/javaapi/, '') // 不可以省略rewrite
      }
    }
  }
})
