import { ElMessage } from 'element-plus'
import router from '../router'

const TOKEN_KEY = 'token'
const TOKEN_EXPIRE_KEY = 'tokenExpireTime'
const USER_INFO_KEY = 'userInfo'
const MENUS_KEY = 'menus'
const CLOCK_SKEW = 5000

let tokenCheckTimer = null
let isHandlingTokenExpire = false

function decodeBase64Url(value = '') {
    const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/')
    const padding = normalizedValue.length % 4
    const paddedValue = padding
        ? normalizedValue.padEnd(normalizedValue.length + (4 - padding), '=')
        : normalizedValue

    return atob(paddedValue)
}

function decodeJWTPayload(token = '') {
    try {
        const [, payload = ''] = token.split('.')
        if (!payload) {
            return null
        }

        return JSON.parse(decodeBase64Url(payload))
    } catch (error) {
        console.error('JWT解析失败:', error)
        return null
    }
}

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) || ''
}

export const getTokenExpireTime = () => {
    const expireTime = Number(localStorage.getItem(TOKEN_EXPIRE_KEY))
    return Number.isFinite(expireTime) && expireTime > 0 ? expireTime : 0
}

export const hasToken = () => {
    return !!getToken()
}

export const saveToken = (token) => {
    if (!token) {
        clearToken()
        return null
    }

    const payload = decodeJWTPayload(token)
    if (!payload?.exp) {
        clearToken()
        return null
    }

    const expireTime = payload.exp * 1000

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXPIRE_KEY, expireTime.toString())

    return payload
}

// 兼容现有调用
export const parseJWT = (token) => {
    return saveToken(token)
}

export const isTokenExpired = () => {
    const token = getToken()
    const expireTime = getTokenExpireTime()

    if (!token || !expireTime) {
        return true
    }

    return Date.now() >= expireTime - CLOCK_SKEW
}

export const isAuthenticated = () => {
    return hasToken() && !isTokenExpired()
}

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRE_KEY)
    localStorage.removeItem(USER_INFO_KEY)
    localStorage.removeItem(MENUS_KEY)
}

export const clearTokenCheckTimer = () => {
    if (tokenCheckTimer) {
        clearTimeout(tokenCheckTimer)
        tokenCheckTimer = null
    }
}

export const handleTokenExpire = async (message = '登录已过期，请重新登录') => {
    if (isHandlingTokenExpire) {
        return
    }

    isHandlingTokenExpire = true
    clearTokenCheckTimer()
    clearToken()

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

export const setupTokenExpiryCheck = () => {
    clearTokenCheckTimer()

    if (!isAuthenticated()) {
        return
    }

    const delay = Math.max(getTokenExpireTime() - Date.now(), 0)
    tokenCheckTimer = window.setTimeout(() => {
        handleTokenExpire()
    }, delay)
}

export const loginOutEffect = async () => {
    clearToken()
    clearTokenCheckTimer()

    if (router.currentRoute.value.path !== '/login') {
        await router.replace('/login')
    }
}
