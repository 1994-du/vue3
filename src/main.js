import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
// elementPlus
import ElementPlus from 'element-plus'
// import './styles/element_plus.scss'
// elementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
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
import { registryComponents } from './components/index.js'
// render 函数
let instance=null
instance = createApp(App)
// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    instance.component(key, component)
}
registryComponents(instance)
instance.use(router)
instance.use(store)
instance.use(ElementPlus)
instance.use(i18n)
instance.mount('#subapp-viewport')