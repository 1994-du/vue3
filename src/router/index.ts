import { createRouter, createWebHistory } from 'vue-router'
import { getToken, isTokenExpired, handleTokenExpire, setupTokenExpiryCheck } from '@/utils/tokenManager'
import { initRoutes, hasDynamicRoutes } from '@/utils/generateRoutes'
import useUserInfoStore from '@/store/pinia/userInfo'
import routes, { ROUTE_MISS_NAME } from './routes'

const WHITE_LIST = ['/login', '/error', '/web-office']

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    const token = getToken()
    const userInfoStore = useUserInfoStore()
    const isRouteMiss = to.name === ROUTE_MISS_NAME

    if (WHITE_LIST.includes(to.path)) {
        if (to.path === '/login' && token && !isTokenExpired()) {
            setupTokenExpiryCheck()
            if (userInfoStore.menus.length) {
                const redirectPath = await initRoutes()
                next({ path: redirectPath, replace: true })
                return
            }
        }

        next()
        return
    }

    if (!token || isTokenExpired()) {
        await handleTokenExpire('')
        next({ path: '/login', replace: true, query: { redirect: to.fullPath } })
        return
    }

    setupTokenExpiryCheck()

    if (userInfoStore.menus.length && (!hasDynamicRoutes() || isRouteMiss)) {
        await initRoutes()
        next({ path: to.fullPath, replace: true })
        return
    }

    next()
})

export default router
