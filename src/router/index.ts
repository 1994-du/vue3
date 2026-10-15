import { createRouter, createWebHistory } from 'vue-router'
import {
    clearAuthState,
    clearTokenCheckTimer,
    getToken,
    isTokenExpired,
    parseJWT,
    redirectToSSO,
    setupTokenExpiryCheck
} from '@/utils/tokenManager'
import { initRoutes, hasDynamicRoutes } from '@/utils/generateRoutes'
import useUserInfoStore from '@/store/pinia/userInfo'
import { getCurrentUserMenu } from '@/api/auth'
import routes, { ROUTE_MISS_NAME } from './routes'

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

    // ② 错误页直接放行
    if (to.path === '/error') return true

    // ④ 未登录 → 整页跳转 SSO，并带回当前要访问的地址
    if (!getToken() || isTokenExpired()) {
        clearTokenCheckTimer()
        clearAuthState()
        redirectToSSO(to.fullPath)
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
