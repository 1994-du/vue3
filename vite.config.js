import { defineConfig,loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({mode,command}) => {
  const env = loadEnv(mode,process.cwd())
  return{
    plugins: [vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver({
          importStyle: 'css',
        })],
      }),
      viteMockServe({
        mockPath: 'mock', // mock 文件存放目录
        enable: command === 'serve', // 仅开发时启用
      })
    ],
    server: {
      port: 3002,
      host: '0.0.0.0', // 允许局域网访问
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
          '/api': {
              target: env.VITE_PROXY,// node服务
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, '/api') // 不可以省略rewrite
          }
      }
    },
    base:'/vue3/',
    build:{
      sourcemap:true,
      // outDir:path.resolve(__dirname,'../../../dist/vue3'),
      outDir:path.resolve(__dirname,'./dist'),
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
    },
    css: {
      postcss: './.postcssrc.js',
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element_index.scss" as *;`,
        },
      },
    },
  }
})