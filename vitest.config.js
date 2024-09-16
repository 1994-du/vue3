import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import VueConfig from './vite.config.js'
export default defineConfig({
  ...VueConfig,
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom', // 使用 jsdom 模拟浏览器环境
    setupFiles: './src/test/vitest.setup.js', // 如果需要初始化配置，可以在这里设置路径
    coverage: {
      provider: 'v8',  // 使用 c8 生成覆盖率报告
      reporter: ['text', 'html'],  // 生成 HTML 和 text 格式的报告
      reportsDirectory: './coverage',  // 指定覆盖率报告输出目录
    },
  },
});