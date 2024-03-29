import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "@/api"
import directive from "./globalDirective";//全局自定义指令
import 'highlight.js/styles/atom-one-dark.css'
import hljsVuePlugin from "@highlightjs/vue-plugin"
import 'highlight.js/lib/common'
import { stripIndent } from 'common-tags';//代码显示空格
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import socket from '@/api/websocket';//即时通讯

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

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
import mitt from 'mitt'
const bus = new mitt()
app.config.globalProperties.$bus = bus
// app.config.globalProperties.$socket=socket;
app.config.globalProperties.$axios=axios;
app.config.globalProperties.$stripIndent=stripIndent;
app.use(ElementPlus)
app.use(store)
app.use(router)
app.use(hljsVuePlugin)
app.use(i18n)
app.mount('#app')

//全局自定义指令
directive(app)
// 或者直接写
// app.directive('focus',{
//     mounted(el){
//         el.focus()
//     }
// })

