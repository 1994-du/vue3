import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Pinia
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// UI 库
import dxUI from '@1994-du/vue3-ui'
import '@1994-du/vue3-ui/lib/style.css'
import '@1994-du/vue3-ui/lib/theme.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './styles/element_plus.scss'

// 工具
import '@/utils/fontSize'
import { persistenceHtmlTheme } from '@/utils/saveHtmlTheme'
import customDirective from '@/utils/customDirective'
import IndexDB from '@/utils/indexedDB'

// 国际化
import LanguageZH from '@/lang/zh-cn'
import LanguageEN from '@/lang/en-us'
import { createI18n } from 'vue-i18n'

// 全局组件
import registryComponents from '@/components/index'

// 事件总线
import mitt from 'mitt'

const app = createApp(App)

// 注册 ElementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 全局属性
registryComponents(app)
app.config.globalProperties.$bus = mitt()

app.use(dxUI)
app.use(ElementPlus as any, { locale: zhCn })
app.use(Antd)
app.use(createI18n({ locale: 'zh-cn', messages: { 'en-us': LanguageEN, 'zh-cn': LanguageZH } }))
app.use(customDirective)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// 挂载前初始化
persistenceHtmlTheme(localStorage.getItem('theme') || 'light')
IndexDB.openDatabase().then(db => (window.db = db)).catch(() => {})

// 路由守卫中处理动态路由，这里直接挂载
app.use(router)
app.mount('#vue3')

// 微前端环境监听
if (window.__MICRO_APP_ENVIRONMENT__ && window.microApp) {
    window.microApp.addDataListener((data: any) => console.info('来自主应用的数据', data), true)
}
