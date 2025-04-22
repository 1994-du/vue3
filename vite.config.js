import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
    base:'./',
    plugins: [
        vue(),
        legacy({
            // 指定兼容的浏览器范围（Browserslist 语法）
            targets: ['chrome 58', '> 1%', 'ie 11'],
            // 为现代浏览器按需注入 Polyfill（减少体积）
            modernPolyfills: true,
            // 核心 Polyfill 库（默认自动注入）
            corejs: '3.33', // 指定 core-js 版本
        }),
    ],
    build: {
        target:['es2015','edge88','firefox78','chrome87','safari13'],// 指定需要兼容的浏览器
        minify: 'terser', // 混淆器，terser 构建后文件体积更小
        terserOptions: {
            compress: {
                drop_console: true, // 生产环境去除 console
                drop_debugger: true, // 生产环境去除 debugger
            },
            format: {
                comments: false // 删除注释
            }
        },
        outDir: 'dist',
        assetsDir: 'static',
        chunkSizeWarningLimit: 1500, // 限制包大小 
        cssCodeSplit: false, // 启用/禁用 CSS 代码拆分
        sourcemap: false, // 构建后是否生成 source map 文件
        
        rollupOptions: {
            // external: ['vue', 'react'],
            output: {
                // globals: {
                //     vue: 'Vue',
                //     react: 'React'
                // },
                // 动态函数分包
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // if (id.includes('echarts')) return 'echarts'
                        // if (id.includes('vue')) return 'vue'
                        // if (id.includes('lodash')) return 'lodash'
                        return 'vendor'
                    }
                }
                // 按模块路径分包
                // manualChunks:{
                //     'vue': ['vue', 'vue-router','vuex'], // 将 vue 相关的模块打包到 vue.js
                //     'element-plus': ['element-plus'], // 将 element-plus 相关的模块打包到 element-plus.js
                //     'echarts': ['echarts'], // 将 echarts 相关的模块打包到 echarts.js
                // }
            }
        }
    },
    css: {
        postcss:"./postcss.config.js",
        preprocessorOptions: {
            scss: {
                // additionalData: `@import "@/styles/variables.scss";` // 根据需要添加
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    test: {
        environment: 'jsdom'
    },
    server: {
        port: '3000',
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
    }
});