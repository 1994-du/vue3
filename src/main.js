import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "@/api"
import directive from "./globalDirective"
const app = createApp(App);
app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')
app.config.globalProperties.$axios=axios;
//全局自定义指令
directive(app)
// 或者直接写
// app.directive('focus',{
//     mounted(el){
//         el.focus()
//     }
// })