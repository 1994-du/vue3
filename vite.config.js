import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

function vendorChunkName(id) {
  if (!id.includes('node_modules')) return

  if (id.includes('/node_modules/@vue/') || id.includes('/node_modules/vue/') || id.includes('/node_modules/vue-router/') || id.includes('/node_modules/pinia/') || id.includes('/node_modules/vue-i18n/')) {
    return 'vendor-vue'
  }

  if (id.includes('/node_modules/element-plus/') || id.includes('/node_modules/@element-plus/')) {
    return 'vendor-element-plus'
  }

  if (id.includes('/node_modules/echarts/')) {
    return 'vendor-echarts'
  }

  if (id.includes('/node_modules/zrender/')) {
    return 'vendor-zrender'
  }

  if (id.includes('/node_modules/three/')) {
    return 'vendor-three'
  }

  if (id.includes('/node_modules/monaco-editor/') || id.includes('/node_modules/@guolao/')) {
    return 'vendor-monaco'
  }

  if (id.includes('/node_modules/ant-design-vue/') || id.includes('/node_modules/@ant-design/')) {
    return 'vendor-ant-design'
  }

  if (id.includes('/node_modules/axios/')) {
    return 'vendor-axios'
  }

  return 'vendor-misc'
}

export default defineConfig(({mode,command}) => {
  console.log('command',command);
  
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
    base:env.VITE_PROJECT_URL,
    build:{
      sourcemap:true,
      chunkSizeWarningLimit: 1200,
      // outDir:path.resolve(__dirname,'../../../dist/vue3'),
      outDir:path.resolve(__dirname,'./dist'),
      emptyOutDir:false,
      rollupOptions:{
        output:{
          manualChunks: vendorChunkName
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
