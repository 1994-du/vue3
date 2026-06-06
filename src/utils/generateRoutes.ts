import router from '@/router'
import useUserInfoStore from '@/store/pinia/userInfo'
import type { MenuItem } from '@/store/pinia/userInfo'

const modules = import.meta.glob('@/views/**/*.vue')

// 将菜单转换为路由
function menusToRoutes(menus: MenuItem[]): any[] {
    return menus
        .filter(m => m.component || m.children?.length)
        .map(menu => {
            const route: any = { path: menu.path, name: menu.name }
            if (menu.component) {
                route.component = modules[`/src/views/${menu.component}.vue`]
            }
            if (menu.children?.length) {
                route.children = menusToRoutes(menu.children)
            }
            return route
        })
}

// 获取默认路由路径
function findDefaultPath(menus: MenuItem[]): string {
    for (const m of menus) {
        if (m.path === '/home') return '/home'
        if (m.path === '/') return '/'
    }
    for (const m of menus) {
        if (m.component) return m.path
        if (m.children?.length) {
            const p = findDefaultPath(m.children)
            if (p) return p
        }
    }
    return '/home'
}

let isInited = false

// 初始化动态路由（幂等）
export async function initRoutes(menusFromLogin?: MenuItem[]): Promise<string> {
    // 防止重复初始化
    if (isInited) return findDefaultPath(useUserInfoStore().menus)

    const store = useUserInfoStore()
    let menus = menusFromLogin || store.menus

    if (!menus.length) return '/login'

    // 登录时同步菜单到 store
    if (menusFromLogin) store.setMenus(menus)

    // 添加路由
    menusToRoutes(menus).forEach(r => router.addRoute('layout', r))
    isInited = true

    return findDefaultPath(menus)
}

export function resetRoutes(): void {
    isInited = false
}

export { findDefaultPath }
