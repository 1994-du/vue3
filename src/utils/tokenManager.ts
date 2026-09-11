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

    try {
        if (router.currentRoute.value.path !== '/login') {
            await router.replace('/login')
        }
    } finally {
        isHandlingTokenExpire = false
    }
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

    if (router.currentRoute.value.path !== '/login') {
        await router.replace('/login')
    }
}
