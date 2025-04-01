import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import axios from "@/api"
import "@/styles/common.scss"
// ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
//全局自定义指令
import directive from "./utils/globalDirective.js";
// elementPlus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文包
import './styles/element_plus.scss'
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
// 全局组件
import registryComponents from './components/index.js'
// 中央事件

// render 函数
let instance=null
instance = createApp(App)
// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    instance.component(key, component)
}
registryComponents(instance)
instance.config.globalProperties.$axios = axios
instance.use(router)
instance.use(store)
instance.use(ElementPlus, { locale: zhCn })
instance.use(Antd)
instance.use(i18n)
instance.mount('#subapp-viewport')
directive(instance)
