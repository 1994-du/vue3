import Vue from 'vue'
//页面入口
import App from './App.vue'
// 路由
import router from './router'
// 状态管理器
import store from './store'
//Axios
import Axios from './api'
Vue.prototype.$axios =Axios;
//ElementUi
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)


new Vue({
    router,
    store,
    render:h=>h(App)
}).$mount('#app')
