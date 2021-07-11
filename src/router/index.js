/*
 * @Description: 
 * @Version: 2.0
 * @Autor: dxx
 * @Date: 2021-07-11 18:02:09
 * @LastEditors: dxx
 * @LastEditTime: 2021-07-11 18:20:00
 */
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/views/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})