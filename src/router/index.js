import { createWebHistory,createWebHashHistory, createRouter } from "vue-router";
import heighCode from "@/utils/highCode"
import routes from './routes'
const router =createRouter({
    history:createWebHistory(),
    routes
})
router.onError=(err)=>{
    console.log('路由错误',err)
}
router.afterEach((to,from)=>{
    console.log(to,from);
    
    console.log('路由跳转完成');
    
    heighCode()
})
export default router;