import { createRouter, createWebHistory } from 'vue-router'
import {
    clearAuthState,
    clearTokenCheckTimer,
    getToken,
    isTokenExpired,
    parseJWT,
    setupTokenExpiryCheck
} from '@/utils/tokenManager'
import { initRoutes, hasDynamicRoutes } from '@/utils/generateRoutes'
import useUserInfoStore from '@/store/pinia/userInfo'
import { getCurrentUserMenu } from '@/api/auth'
import routes, { ROUTE_MISS_NAME } from './routes'

// SSO 统一登录地址（生产环境）。本地联调时改成 SSO 的 dev 地址，如 http://127.0.0.1:5273/#/login
const SSO_LOGIN_URL = 'http://106.15.207.57/SSOLogin/#/login'

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})

router.beforeEach(async to => {
    const userInfoStore = useUserInfoStore()

    // ① SSO 回跳：URL 携带 token，在此落地并初始化登录态
    if (to.query.token) {
        parseJWT(String(to.query.token))
        setupTokenExpiryCheck()
        try {
            const menuRes = await getCurrentUserMenu()
            if (menuRes.code === 200) userInfoStore.setMenus(menuRes.data)
        } catch {
            // 菜单拉取失败不阻断登录，进入应用后再补
        }
        const defaultPath = await initRoutes(userInfoStore.menus)
        // 清掉 URL 里的 token（避免泄露到历史/referer），进入目标页
        return { path: to.path || defaultPath, query: {}, replace: true }
    }

    // ② 已登录访问 /login → 直接进入应用
    if (to.path === '/login' && getToken() && !isTokenExpired()) {
        setupTokenExpiryCheck()
        if (userInfoStore.menus.length) {
            const redirectPath = await initRoutes()
            return { path: redirectPath, replace: true }
        }
    }

    // ③ 错误页直接放行
    if (to.path === '/error') return true

    // ④ 未登录 → 整页跳转 SSO，并带回当前要访问的地址
    if (!getToken() || isTokenExpired()) {
        clearTokenCheckTimer()
        clearAuthState()
        const base = (import.meta.env.VITE_PROJECT_URL || '').replace(/\/$/, '')
        const redirectUrl = location.origin + base + to.fullPath
        window.location.href = `${SSO_LOGIN_URL}?redirect=${encodeURIComponent(redirectUrl)}`
        return false
    }

    setupTokenExpiryCheck()

    if (userInfoStore.menus.length && (!hasDynamicRoutes() || to.name === ROUTE_MISS_NAME)) {
        await initRoutes()
        return { path: to.fullPath, replace: true }
    }

    return true
})

export default router
