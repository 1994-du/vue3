import { ElMessage } from 'element-plus'
import router from '@/router'
import useUserInfoStore from '@/store/pinia/userInfo'
import { resetRoutes } from '@/utils/generateRoutes'

import {
    clearToken,
    getToken,
    getTokenExpireTime,
    hasToken,
    isAuthenticated,
    isTokenExpired,
    saveToken
} from '@/utils/authStorage'
import type { JWTPayload } from '@/utils/authStorage'
export {
    clearToken,
    getToken,
    getTokenExpireTime,
    hasToken,
    isAuthenticated,
    isTokenExpired,
    saveToken
}
export type { JWTPayload }

// SSO 统一登录地址（生产环境）。本地联调时改成 SSO 的 dev 地址，如 http://127.0.0.1:5273/#/login
const SSO_LOGIN_URL = 'http://106.15.207.57/SSOLogin/#/login'

// 未登录 / 登录过期 / 退出 → 整页跳转 SSO，并带回当前要访问的地址
export function redirectToSSO(redirectPath?: string): void {
    const base = (import.meta.env.VITE_PROJECT_URL || '').replace(/\/$/, '')
    const target = redirectPath || location.origin + base + router.currentRoute.value.fullPath
    window.location.href = `${SSO_LOGIN_URL}?redirect=${encodeURIComponent(target)}`
}

let tokenCheckTimer: number | null = null
let isHandlingTokenExpire = false

export const parseJWT = (token: string): JWTPayload | null => saveToken(token)

export function clearAuthState(): void {
    clearToken()
    const userInfoStore = useUserInfoStore()
    userInfoStore.clearMenus()
    userInfoStore.clearUserInfo()
    resetRoutes()
}

export const clearTokenCheckTimer = (): void => {
    if (tokenCheckTimer) {
        clearTimeout(tokenCheckTimer)
        tokenCheckTimer = null
    }
}

export const handleTokenExpire = async (message: string = '登录已过期，请重新登录'): Promise<void> => {
    if (isHandlingTokenExpire) {
        return
    }

    isHandlingTokenExpire = true
    clearTokenCheckTimer()
    clearAuthState()

    if (message) {
        ElMessage.warning(message)
    }

    redirectToSSO()
    isHandlingTokenExpire = false
}

export const setupTokenExpiryCheck = (): void => {
    clearTokenCheckTimer()

    if (!isAuthenticated()) {
        return
    }

    const delay = Math.max(getTokenExpireTime() - Date.now(), 0)
    tokenCheckTimer = window.setTimeout(() => {
        handleTokenExpire()
    }, delay)
}

export const loginOutEffect = async (): Promise<void> => {
    clearTokenCheckTimer()
    clearAuthState()
    redirectToSSO()
}
