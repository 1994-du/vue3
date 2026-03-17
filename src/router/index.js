import { createWebHistory,createWebHashHistory, createRouter } from "vue-router";
import { initRoutes } from "@/utils/generateRoutes.js";

import routes from './routes'
const router =createRouter({
    history:createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})
router.onError=(err)=>{
    console.log('路由错误',err)
}
let isAddRoute = false
router.beforeEach(async (to,from,next)=>{
    if (!isAddRoute) {
        initRoutes()
        isAddRoute = true
        next({ ...to, replace: true })
    } else {
        next()
    }
})
export default router;