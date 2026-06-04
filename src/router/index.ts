import { createRouter as createVueRouter, Router, createWebHistory } from 'vue-router'
import { getToken, handleTokenExpire, isTokenExpired, setupTokenExpiryCheck } from '@/utils/tokenManager'
import routes from './routes'
import { initRoutes } from '@/utils/generateRoutes'

const WHITE_LIST = ['/login', '/error', '/web-office']

const router: Router = createVueRouter({
    history: createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})

router.onError = ((err: Error) => {
    console.log('路由错误', err)
}) as any

router.beforeEach(async (to, from, next) => {
    const hasToken = !!getToken()
    const isWhiteRoute = WHITE_LIST.includes(to.path)

    if (isWhiteRoute) {
        if (to.path === '/login' && hasToken && !isTokenExpired()) {
            await initRoutes()
            return next({
                path: '/home',
                replace: true
            })
        }

        return next()
    }

    if (!hasToken) {
        return next({
            path: '/login',
            replace: true
        })
    }

    if (isTokenExpired()) {
        await handleTokenExpire()
        return next(false)
    }

    setupTokenExpiryCheck()

    if (to.matched.length === 0) {
        await initRoutes()

        if (router.resolve(to.fullPath).matched.length === 0) {
            return next({
                path: '/home',
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

export default router
