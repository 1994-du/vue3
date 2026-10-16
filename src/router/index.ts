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
import { decodeJWTPayload } from '@/utils/authStorage'
import { initRoutes, hasDynamicRoutes } from '@/utils/generateRoutes'
import useUserInfoStore from '@/store/pinia/userInfo'
import { getCurrentUserProfile } from '@/api/auth'
import routes, { ROUTE_MISS_NAME } from './routes'

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})

router.beforeEach(async to => {
    const userInfoStore = useUserInfoStore()

    // ① SSO 回跳 / 切换用户：URL 携带 token，在此落地并初始化登录态
    if (to.query.token) {
        const incoming = String(to.query.token)
        const payload = decodeJWTPayload(incoming)
        // 非法 / 过期 token：不切换到无效身份，清掉当前态后回 SSO 重新登录
        if (!payload?.exp || payload.exp * 1000 <= Date.now()) {
            clearAuthState()
            redirectToSSO(to.fullPath)
            return false
        }
        // 切换用户：先清掉当前用户(A)的 token / 菜单 / 路由 / 用户信息，再换成他人(B)
        clearAuthState()
        parseJWT(incoming)
        setupTokenExpiryCheck()
        try {
            const res = await getCurrentUserProfile()
            if (res.code === 200 && res.data) {
                userInfoStore.setMenus(res.data.menus || [])
                userInfoStore.setUserInfo({
                    name: res.data.username || '',
                    username: res.data.username,
                    avatar: res.data.avatar || ''
                })
            }
        } catch (error) {
            // 不再静默吞异常，便于定位后端接口问题
            console.error('[sso] 获取当前用户信息失败', error)
        }
        const defaultPath = await initRoutes(userInfoStore.menus)
        // 目标页若不在对方菜单路由内，回退到默认首页，避免 404
        const target = to.name && router.hasRoute(to.name) ? to.path : defaultPath
        // 清掉 URL 里的 token（避免泄露到历史/referer），进入目标页
        return { path: target || defaultPath, query: {}, replace: true }
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
