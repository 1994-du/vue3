import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import alias from "@rollup/plugin-alias";
// import removeConsole from 'vite-plugin-remove-console';

// const removeConsolePlugin = removeConsole({
//     include: [/src/],
//     exclude: [],
//     functions: ['console.log', 'console.warn', 'console.error'],
//     env: 'all' // 设置为 all 表示在所有环境下生效
// });

export default defineConfig({
    base:'./',
    publicDir: './public',
    plugins: [
        alias(),
        vue(),
    ],
    build: {
        outDir: 'dist',
        assetsDir: 'static',
        chunkSizeWarningLimit: 1500, // 限制包大小 
        cssCodeSplit: false, // 启用/禁用 CSS 代码拆分
        sourcemap: false, // 构建后是否生成 source map 文件
        minify: 'terser', // 混淆器，terser 构建后文件体积更小
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor'; // 将所有 node_modules 中的模块打包到 vendor.js
                    }
                }
            }
        }
    },
    css: {
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