import { defineStore } from 'pinia'

interface UserInfo {
    name: string
    avatar: string
    username?: string
}

interface MenuItem {
    path: string
    name: string
    component?: string
    children?: MenuItem[]
    [key: string]: unknown
}

interface UserInfoState {
    userInfo: UserInfo
    menus: MenuItem[]
}

const LEGACY_MENUS_KEY = 'menus'
const USER_INFO_STORE_KEY = 'userInfo-store'

function loadLegacyMenus(): MenuItem[] {
    try {
        const raw = localStorage.getItem(LEGACY_MENUS_KEY)
        if (!raw) {
            return []
        }

        const parsed: unknown = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []

        localStorage.removeItem(LEGACY_MENUS_KEY)
        return parsed as MenuItem[]
    } catch {
        return []
    }
}

const useUserInfoStore = defineStore('userInfo', {
    state: (): UserInfoState => ({
        userInfo: { name: 'default', avatar: '' },
        menus: loadLegacyMenus()
    }),
    actions: {
        setMenus(menus: MenuItem[]): void {
            this.menus = Array.isArray(menus) ? menus : []
        },
        clearMenus(): void {
            this.menus = []
        },
        setUserInfo(userInfo: Partial<UserInfo>): void {
            this.userInfo = Object.assign({}, this.userInfo, userInfo)
        },
        clearUserInfo(): void {
            this.userInfo = { name: 'default', avatar: '' }
        }
    },
    persist: {
        key: USER_INFO_STORE_KEY,
        storage: localStorage,
        pick: ['userInfo', 'menus']
    }
})

export default useUserInfoStore
export type { MenuItem }
