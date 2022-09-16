import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import antUi from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "@/api"
const app = createApp(App);
app.use(ElementPlus)
app.use(antUi)
app.use(router)
app.mount('#app')
app.config.globalProperties.$axios=axios;