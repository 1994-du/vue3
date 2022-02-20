import { createApp } from 'vue'
//页面入口
import App from './App.vue'
// 路由
import router from './router'
// 状态管理器
import store from './store'

createApp(App).use(router).use(store).mount('#app')
