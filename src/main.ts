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
/* 这里刻意不引 './styles/element_plus.scss'。那份文件把 EP 的 theme-chalk 全量
   编译了一遍，但 vite.config.js 的 additionalData 会先注入 element_index.scss
   的 $namespace: 'vue3'，于是它产出的 5622 条规则全是 .vue3-* 前缀，而运行时
   DOM 用的是 .el-*，一条都匹配不上（实测占 index.css 的 46%、约 195KB）。
   真正生效的 EP 样式来自 vite.config.js 里 importStyle: 'css' 的按需注入，
   主题覆盖来自 design-system.scss。详见 element_plus.scss 顶部说明。 */
import './styles/design-system.scss'
import './styles/admin-page.scss'

// 工具
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

// 全局属性
registryComponents(app)
app.config.globalProperties.$bus = mitt()

app.use(dxUI)
app.use(ElementPlus, { locale: zhCn })
app.use(createI18n({ locale: 'zh-cn', messages: { 'en-us': LanguageEN, 'zh-cn': LanguageZH } }))
app.use(customDirective)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// 挂载前初始化（未来玻璃主题默认深色，浅色为备选）
persistenceHtmlTheme(localStorage.getItem('theme') || 'dark')
IndexDB.openDatabase().then(db => (window.db = db)).catch(() => {})

// 动态路由由路由守卫统一恢复，启动入口只负责注册并挂载应用。
async function bootstrap(): Promise<void> {
    app.use(router)
    await router.isReady()
    app.mount('#vue3')
}

bootstrap().catch(error => {
    console.error('bootstrap failed:', error)
})

// 微前端环境监听
if (window.__MICRO_APP_ENVIRONMENT__ && window.microApp) {
    window.microApp.addDataListener((data: unknown) => console.info('来自主应用的数据', data), true)
}
