import { createApp, App as VueApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './api'

import { createPinia, Pinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 设置基础字体大小
import '@/utils/fontSize'

// 引入组件库
import dxUI from '@1994-du/vue3-ui'
import '@1994-du/vue3-ui/lib/style.css'
import '@1994-du/vue3-ui/lib/theme.css'

// 连接IndexDB
import IndexDB from '@/utils/indexedDB'

async function connectIndexDB() {
    try {
        window.db = await IndexDB.openDatabase()
    } catch (e) {
        console.error('打开数据库失败', e)
    }
}

connectIndexDB()

// 设置html主题
import { persistenceHtmlTheme } from '@/utils/saveHtmlTheme'
persistenceHtmlTheme(localStorage.getItem('theme') || 'light')

// ant-design-vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 全局自定义指令
import customDirective from '@/utils/customDirective'

// elementPlus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './styles/element_plus.scss'
import '@/styles/common.scss'

// elementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 国际化
import LanguageZH from '@/lang/zh-cn'
import LanguageEN from '@/lang/en-us'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'zh-cn',
    messages: {
        'en-us': LanguageEN,
        'zh-cn': LanguageZH
    }
})

// 全局组件
import registryComponents from '@/components/index'

// 中央事件
import mitt from 'mitt'

const bus = mitt()

// 登录过期处理
import { clearToken, isAuthenticated, setupTokenExpiryCheck } from '@/utils/tokenManager'

// render 函数
let instance: VueApp | null = null

instance = createApp(App)

// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    instance.component(key, component)
}

registryComponents(instance)
instance.config.globalProperties.$axios = axios
instance.config.globalProperties.$bus = bus

instance.use(store as any)
instance.use(dxUI)
instance.use(ElementPlus as any, {
    locale: zhCn
})
instance.use(Antd)
instance.use(i18n)

const pinia: Pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
instance.use(pinia)

customDirective(instance)

// 动态路由注册
async function bootstrap() {
    if (isAuthenticated()) {
        await import('@/utils/generateRoutes').then(({ initRoutes }) => initRoutes())
        setupTokenExpiryCheck()
    } else {
        clearToken()
    }

    instance!.use(router) // 再注册router
    instance!.mount('#vue3')
}

bootstrap()

if (window.__MICRO_APP_ENVIRONMENT__) {
    console.info('我在微前端环境中')

    // 监听函数
    function dataListener(data: any) {
        console.info('来自主应用的数据', data)
    }

    // 监听数据变化，初始化时如果有数据则主动触发一次
    if (window.microApp) {
        window.microApp.addDataListener(dataListener, true)
    }
}
