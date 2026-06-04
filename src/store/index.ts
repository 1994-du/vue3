import { createStore } from 'vuex'
import type { Store } from 'vuex'

interface State {
    name: string
    age: number
    userInfo: any
    menuRoute: any
    menuData: any[]
    breadCrumb: any[]
}

export default createStore({
    // 全局变量
    state: (): State => ({
        name: '张三',
        age: 0,
        userInfo: {},
        menuRoute: null,
        menuData: [],
        breadCrumb: []
    }),
    // 同步操作
    mutations: {
        // 菜单数据
        SYNC_SET_MENUDATA(state: State, arg: any[]): void {
            state.menuData = arg
        },
        // 添加面包屑
        SYNC_PUSH_BREADCRUMB(state: State, arg: any): void {
            state.breadCrumb.push(arg)
        },
        // 移除面包屑
        SYNC_POP_BREADCRUMB(state: State): void {
            state.breadCrumb.pop()
        },
        // 重置面包屑
        SYNC_SET_BREADCRUMB(state: State, arg: any[]): void {
            state.breadCrumb = arg
        },
        // 保存状态
        SAVE_STATE(state: State): void {
            localStorage.setItem('store', JSON.stringify(state))
        },
        // 读取状态
        READ_STATE(state: State): void {
            const local = JSON.parse(localStorage.getItem('store') || '{}')
            Object.assign(state, local)
        },
        // 初始化状态
        SYNC_INIT_STATE(state: State): void {
            Object.assign(state, {
                userInfo: {},
                menuRoute: null,
                menuData: [],
                breadCrumb: []
            })
        },
        // 设置用户信息
        SYNC_SET_USERINFO(state: State, arg: any): void {
            state.userInfo = arg
        },
        CHANGE_AGE(state: State, arg: { num: number }): void {
            state.age += arg.num
        }
    },
    // 异步操作
    actions: {
        ASYNC_SET_USERINFO({ commit }: any, arg: any): void {
            commit('SYNC_SET_USERINFO', arg)
        },
        ASYNC_CHANGE_AGE({ commit }: any, arg: { num: number }): void {
            commit('CHANGE_AGE', arg)
        }
    },
    // 计算属性
    getters: {
        info: (state: State): string => `姓名：${state.name},年龄：${state.age}`,
        moreinfo: (state: State, getters: any): string => state.age + state.name + getters.info,
        setName: (state: State) => ((p: string) => state.name + p)
    }
})
