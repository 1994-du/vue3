import { createWebHistory,createWebHashHistory, createRouter } from "vue-router";
import heighCode from "@/utils/highCode"
import routes from './routes'
const router =createRouter({
    history:createWebHashHistory(),
    routes
})
router.onError=(err)=>{
    console.log('路由错误',err)
}

router.beforeEach((to,from,next)=>{
    let username = localStorage.getItem('username')
    if(!username && to.path !== '/login'){
        next({path:'/login'})
    }else{
        next()
    }
})
router.afterEach((to,from)=>{
    heighCode()
})
export default router;