export interface JWTPayload {
    exp?: number
    [key: string]: unknown
}

const TOKEN_KEY = 'token'
const TOKEN_EXPIRE_KEY = 'tokenExpireTime'
const USER_INFO_KEY = 'userInfo'
const CLOCK_SKEW = 5000

function decodeBase64Url(value: string): string {
    const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/')
    const padding = normalizedValue.length % 4
    const paddedValue = padding
        ? normalizedValue.padEnd(normalizedValue.length + (4 - padding), '=')
        : normalizedValue

    return atob(paddedValue)
}

export function decodeJWTPayload(token: string): JWTPayload | null {
    try {
        const payload = token.split('.')[1]
        if (!payload) return null

        const parsed: unknown = JSON.parse(decodeBase64Url(payload))
        return parsed && typeof parsed === 'object' ? parsed as JWTPayload : null
    } catch {
        return null
    }
}

export function getToken(): string {
    return localStorage.getItem(TOKEN_KEY) || ''
}

export function getTokenExpireTime(): number {
    const expireTime = Number(localStorage.getItem(TOKEN_EXPIRE_KEY))
    return Number.isFinite(expireTime) && expireTime > 0 ? expireTime : 0
}

export function hasToken(): boolean {
    return Boolean(getToken())
}

export function saveToken(token: string): JWTPayload | null {
    if (!token) {
        clearToken()
        return null
    }

    const payload = decodeJWTPayload(token)
    if (!payload?.exp || !Number.isFinite(payload.exp)) {
        clearToken()
        return null
    }

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXPIRE_KEY, String(payload.exp * 1000))
    return payload
}

export function isTokenExpired(): boolean {
    const expireTime = getTokenExpireTime()
    return !hasToken() || !expireTime || Date.now() >= expireTime - CLOCK_SKEW
}

export function isAuthenticated(): boolean {
    return hasToken() && !isTokenExpired()
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRE_KEY)
    localStorage.removeItem(USER_INFO_KEY)
}