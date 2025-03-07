import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import axios from "@/api"
import "@/styles/common.scss"
// ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// import './../scripts/generateRoutes.js'

// 全局打开数据库
import startIndexedDB from '@/utils/startIndexedDB'
startIndexedDB.openDatabase()
//全局自定义指令
import directive from "./utils/globalDirective.js";
// elementPlus
import ElementPlus from 'element-plus'
import './styles/element_plus.scss'
// elementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import mitt from 'mitt'
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
const bus = new mitt()
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
instance.use(router)
instance.use(store)
instance.use(ElementPlus)
instance.use(Antd)
instance.use(i18n)
instance.mount('#subapp-viewport')
directive(instance)


function* numberGenerator() {
    let num = yield "Please provide a number";
    console.log(`You provided: ${num}`);
    yield 2
    yield 3
    yield 4
    return 6
}

const gen = numberGenerator();
console.log(gen.next());  // "Please provide a number"
console.log(gen.next(42)); // "You provided: 42"
console.log(gen.next()); 
console.log(gen.next()); 
console.log(gen.next()); 
console.log(gen.next()); 
// console.log(next(gen));
