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

const PRODUCTION_SSO_LOGIN_URL = 'http://106.15.207.57/SSOLogin/#/login'

function getSSOLoginUrl(): string {
    const configuredUrl = import.meta.env.VITE_SSO_LOGIN_URL?.trim()
    if (configuredUrl) return configuredUrl

    if (import.meta.env.DEV) {
        return `${location.protocol}//${location.hostname}:5273/#/login`
    }

    return PRODUCTION_SSO_LOGIN_URL
}

/**
 * 未登录 / 登录过期 / 退出 → 整页跳转 SSO，并带回当前要访问的地址。
 *
 * 回跳地址必须是「带当前域名的完整 URL」：SSO 登录页拿到相对路径时会拼到它自己的域名上，
 * 本地开发（localhost）登录后就会被送回线上。这里不截取域名、不写死域名，统一以当前
 * 页面的 origin 为基准拼成绝对地址 —— 本地启动 → 登录后回本地，生产 → 回生产。
 */
export function redirectToSSO(redirectPath?: string): void {
    const base = (import.meta.env.VITE_PROJECT_URL || '').replace(/\/$/, '')
    const raw = redirectPath || router.currentRoute.value.fullPath

    let target: string
    if (/^https?:\/\//i.test(raw)) {
        // 已经是绝对地址，原样保留，不再截取
        target = raw
    } else {
        const normalized = raw.startsWith('/') ? raw : `/${raw}`
        // vue-router 的 fullPath 不含 base，生产环境需补上；若已携带则避免重复拼接
        const withBase = base && normalized !== base && !normalized.startsWith(`${base}/`)
            ? `${base}${normalized}`
            : normalized
        target = `${location.origin}${withBase}`
    }

    // 剥掉 token：SSO 回跳失败时 to.fullPath 会带着 ?token=，直接传回去会让登录凭证
    // 出现在 SSO URL / Referer / 历史记录里，也会造成回跳地址里 token 参数重复。
    try {
        const url = new URL(target)
        url.searchParams.delete('token')
        target = url.toString()
    } catch {
        // target 由上一步构造，理论上一定合法；异常时保持原值
    }

    window.location.href = `${getSSOLoginUrl()}?redirect=${encodeURIComponent(target)}`
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
