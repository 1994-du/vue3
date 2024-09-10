import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import alias from "@rollup/plugin-alias"
import { configDefaults } from 'vitest/config';
export default defineConfig({
  define: {
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': true, // 根据需要设置为 true 或 false
  },
  publicDir:'./public',
  plugins: [
    alias(),
    vue(),
  ],
  test: {
    globals: true,
    environment: 'jsdom', // 使用 jsdom 模拟浏览器环境
    // setupFiles: './vitest.config.js', // 如果需要初始化配置
    exclude: [...configDefaults.exclude, 'e2e/*'], // 排除的测试目录
  },
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'./src')
    }
  },
  server: {
    port: '3000',
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
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
