import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "@/api"
import directive from "./globalDirective"
import 'highlight.js/styles/atom-one-dark.css'
import hljsVuePlugin from "@highlightjs/vue-plugin"
import 'highlight.js/lib/common'

// import socket from './socket'
const app = createApp(App);
app.config.globalProperties.$axios=axios;
// app.config.globalProperties.$socket=socket
app.use(ElementPlus)
app.use(store)
app.use(router)
app.use(hljsVuePlugin)
app.mount('#app')

//全局自定义指令
directive(app)
// 或者直接写
// app.directive('focus',{
//     mounted(el){
//         el.focus()
//     }
// })

