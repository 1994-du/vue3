import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import axios from "@/api"

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 设置基础字体大小
import '@/utils/fontSize.js'
// 引入组件库
import dxUI from '@1994-du/vue3-ui'
import '@1994-du/vue3-ui/lib/style.css'
import '@1994-du/vue3-ui/lib/theme.css'
// 连接IndexDB
import IndexDB from '@/utils/indexedDB';
async function connectIndexDB(){
    try {
        window.db = await IndexDB.openDatabase();
    }
    catch (e) {
        console.error('打开数据库失败',e);
    }  
}
connectIndexDB();
// 设置html主题
import { persistenceHtmlTheme } from './utils/saveHtmlTheme.js'
persistenceHtmlTheme(localStorage.getItem('theme'))
// ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
//全局自定义指令
import customDirective from "./utils/customDirective.js";
// elementPlus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文包
import './styles/element_plus.scss'
import "@/styles/common.scss"
// elementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 
import { initRoutes } from '@/utils/generateRoutes.js'
// 国际化
import LanguageZH from '@/lang/zh-cn.js'
import LanguageEN from '@/lang/en-us.js'
import { createI18n } from 'vue-i18n'
const i18n = new createI18n({
    locale:'zh-cn',
    messages:{
        'en-us':LanguageEN,
        'zh-cn':LanguageZH
    }
})
// 全局组件
import registryComponents from './components/index.js'
// 中央事件
import mitt from 'mitt'
const bus = new mitt()
// 登录过期处理
import { clearToken, isAuthenticated, setupTokenExpiryCheck } from '@/utils/tokenManager.js'
// render 函数
let instance=null
instance = createApp(App)
// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    instance.component(key, component)
}
registryComponents(instance)
instance.config.globalProperties.$axios = axios
instance.config.globalProperties.$bus = bus

instance.use(store)
instance.use(dxUI)
instance.use(ElementPlus, { 
    namespace:'vue3',
    locale: zhCn 
})
instance.use(Antd)
instance.use(i18n)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
instance.use(pinia)
customDirective(instance)
// 动态路由注册
async function bootstrap(){
    if (isAuthenticated()) {
        await initRoutes()
        setupTokenExpiryCheck()
    } else {
        clearToken()
    }

    instance.use(router) // 再注册router
    instance.mount('#vue3') 
}
bootstrap()
if (window.__MICRO_APP_ENVIRONMENT__) {
  console.info('我在微前端环境中')
  // 监听数据变化
  // window.microApp.addDataListener(dataListener)

  // 监听数据变化，初始化时如果有数据则主动触发一次
  window.microApp.addDataListener(dataListener, true)

  // 解绑监听函数
  // window.microApp.removeDataListener(dataListener)

  // 清空当前子应用的所有绑定函数(全局数据函数除外)
  // window.microApp.clearDataListener()
}

// 监听函数
function dataListener (data) {
  console.info('来自主应用的数据', data)
}
