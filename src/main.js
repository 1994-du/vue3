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

import { renderWithQiankun,qiankunWindow,QiankunProps } from "vite-plugin-qiankun/dist/helper"

import mitt from 'mitt'
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
const bus = new mitt()
// render 函数
let instance=null
const render = (props={}) => {
    instance = createApp(App)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        instance.component(key, component)
    }
    instance.config.globalProperties.$axios = axios
    instance.config.globalProperties.$bus = bus
    instance.config.globalProperties.$stripIndent = stripIndent
    instance.use(router)
    instance.use(store)
    instance.use(ElementPlus)
    instance.use(hljsVuePlugin)
    instance.use(i18n)
    instance.mount('#subapp-viewport')
    directive(instance)
}
renderWithQiankun({
    bootstrap(){
        console.log('child2 bootstrap');
    },
    mount(props){
        render(props)
        console.log('child2 mount');
    },
    unmount(props){
        console.log('child2 unmount');
    },
    updata(props){
        console.log('child2 updata');
    }
})
if(!qiankunWindow.__POWERED_BY_QIANKUN__){
    render()
}