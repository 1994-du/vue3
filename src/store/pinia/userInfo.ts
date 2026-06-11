import { defineStore } from 'pinia'

interface UserInfo {
    name: string
    age: number
    avatar: string
    [key: string]: any
}

interface MenuItem {
    path: string
    name: string
    component?: string
    children?: MenuItem[]
    [key: string]: any
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

        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const useUserInfoStore = defineStore('userInfo', {
    state: (): UserInfoState => ({
        userInfo: { name: 'default', age: 0, avatar: '' },
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
            this.userInfo = { name: 'default', age: 0, avatar: '' }
        },
        increment(): void {
            this.userInfo.age++
        },
        decrement(): void {
            this.userInfo.age--
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
