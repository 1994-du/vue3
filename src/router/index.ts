import { createRouter, createWebHistory } from 'vue-router'
import { clearAuthState, clearTokenCheckTimer, getToken, isTokenExpired, setupTokenExpiryCheck } from '@/utils/tokenManager'
import { initRoutes, hasDynamicRoutes } from '@/utils/generateRoutes'
import useUserInfoStore from '@/store/pinia/userInfo'
import routes, { ROUTE_MISS_NAME } from './routes'

const WHITE_LIST = ['/login', '/error']

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})

router.beforeEach(async to => {
    const token = getToken()
    const userInfoStore = useUserInfoStore()
    const isRouteMiss = to.name === ROUTE_MISS_NAME

    if (WHITE_LIST.includes(to.path)) {
        if (to.path === '/login' && token && !isTokenExpired()) {
            setupTokenExpiryCheck()
            if (userInfoStore.menus.length) {
                const redirectPath = await initRoutes()
                return { path: redirectPath, replace: true }
            }
        }

        return true
    }

    if (!token || isTokenExpired()) {
        clearTokenCheckTimer()
        clearAuthState()
        return { path: '/login', replace: true, query: { redirect: to.fullPath } }
    }

    setupTokenExpiryCheck()

    if (userInfoStore.menus.length && (!hasDynamicRoutes() || isRouteMiss)) {
        await initRoutes()
        return { path: to.fullPath, replace: true }
    }

    return true
})

export default router
