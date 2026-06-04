/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus' {
  export * from 'element-plus'
}

declare module '@element-plus/icons-vue' {
  export * from '@element-plus/icons-vue'
}
