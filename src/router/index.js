import { createWebHistory,createWebHashHistory, createRouter } from "vue-router";
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import routes from './routes'
const router =createRouter({
    history:createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__?'/child2':'/'),
    routes
})
router.onError=(err)=>{
    console.log('路由错误',err)
}
// router.beforeEach((to,from,next)=>{
//     const token =sessionStorage.getItem('token')
//     if(to.path==='/login'){
//         next()
//     }else{
//         if(token){
//             next()
//         }else{
//             next('/login')
//         }
//     }
// })
export default router;