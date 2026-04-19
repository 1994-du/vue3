import { createWebHistory,createWebHashHistory, createRouter } from "vue-router";
import { isTokenExpired,handleTokenExpire } from '@/utils/tokenManager'
import routes from './routes'
import { initRoutes } from '@/utils/generateRoutes'
import { getDefaultRoutePath } from '@/utils/menuRoute'
const router =createRouter({
    history:createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})
router.onError=(err)=>{
    console.log('路由错误',err)
}
router.beforeEach(async (to,from,next)=>{
    if(to.path!=='/login'&&isTokenExpired()){
        handleTokenExpire();
        return next(false)
    }

    if (to.path !== '/login' && localStorage.getItem('token') && to.matched.length === 0) {
        await initRoutes()

        if (router.resolve(to.fullPath).matched.length === 0) {
            return next({
                path: getDefaultRoutePath(),
                replace: true
            })
        }

        return next({
            path: to.fullPath,
            replace: true
        })
    }

    next()
})
export default router;
