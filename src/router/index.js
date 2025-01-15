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
    heighCode()
})
export default router;