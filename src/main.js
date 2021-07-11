/*
 * @Description: rom 
 * @Version: 2.0
 * @Autor: dxx
 * @Date: 2021-07-11 18:02:09
 * @LastEditors: dxx
 * @LastEditTime: 2021-07-11 18:25:54
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
Vue.config.productionTip = false
import UI from "./components/index"
Vue.use(UI)
import G6 from "@antv/g6"
Vue.prototype.$G6 = G6;

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
