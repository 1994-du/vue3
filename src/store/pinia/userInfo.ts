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

const useUserInfoStore = defineStore('userInfo', {
    state: (): UserInfoState => {
        return {
            userInfo: {
                name: 'default',
                age: 0,
                avatar: ''
            },
            menus: []
        }
    },
    getters: {},
    actions: {
        setMenus(menus: MenuItem[]): void {
            this.menus = menus
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
