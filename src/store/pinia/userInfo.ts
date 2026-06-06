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

const MENUS_KEY = 'menus'

function loadPersistedMenus(): MenuItem[] {
    try {
        const raw = localStorage.getItem(MENUS_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const useUserInfoStore = defineStore('userInfo', {
    state: (): UserInfoState => ({
        userInfo: { name: 'default', age: 0, avatar: '' },
        menus: loadPersistedMenus()
    }),
    actions: {
        setMenus(menus: MenuItem[]): void {
            this.menus = menus
            localStorage.setItem(MENUS_KEY, JSON.stringify(menus))
        },
        clearMenus(): void {
            this.menus = []
            localStorage.removeItem(MENUS_KEY)
        },
        setUserInfo(userInfo: Partial<UserInfo>): void {
            this.userInfo = Object.assign({}, this.userInfo, userInfo)
        },
        increment(): void {
            this.userInfo.age++
        },
        decrement(): void {
            this.userInfo.age--
        }
    }
})

export default useUserInfoStore
export type { MenuItem }
