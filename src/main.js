// import { createApp } from 'vue'
import Vue from 'vue'
//页面入口
import App from './App.vue'
// 路由
import router from './router'
// 状态管理器
import store from './store'


// import { GcSpreadSheets, GcWorksheet, GcColumn } from '@grapecity/spread-sheets-vue'
// let app = createApp(App);
// app.component('gc-spread-sheets', GcSpreadSheets);
// app.component('gc-worksheet', GcWorksheet);
// app.component('gc-column', GcColumn);

// createApp(App).use(router).use(store).mount('#app')

new Vue({
    router,
    store,
    render:h=>h(App)
}).$mount('#app')
