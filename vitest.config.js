import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom', // 使用 jsdom 模拟浏览器环境
    // setupFiles: './tests/setup.js', // 如果需要初始化配置，可以在这里设置路径
  },
});