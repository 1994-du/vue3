import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import useUserInfoStore from '@/store/pinia/userInfo'
import type { MenuItem } from '@/store/pinia/userInfo'
import { resolveMenuFullPath } from '@/utils/menuRoute'

const modules = import.meta.glob('@/views/**/*.vue')
const addedRouteNames = new Set<string>()

function getComponent(menu: MenuItem): (() => Promise<unknown>) | undefined {
    if (typeof menu.component !== 'string' || !menu.component.trim()) return undefined

    const componentPath = `/src/views/${menu.component}.vue`
    return Object.prototype.hasOwnProperty.call(modules, componentPath)
        ? modules[componentPath]
        : undefined
}

function isValidMenu(menu: MenuItem): boolean {
    return typeof menu.path === 'string'
        && menu.path.trim().length > 0
        && typeof menu.name === 'string'
        && menu.name.trim().length > 0
        && (menu.children === undefined || Array.isArray(menu.children))
}

function buildRouteName(menu: MenuItem, fullPath: string): string {
    return menu.name.trim() || fullPath
}

function createRouteRecord(menu: MenuItem, parentPath: string = ''): RouteRecordRaw[] {
    if (!isValidMenu(menu)) {
        console.warn('[routes] invalid menu item skipped', menu)
        return []
    }

    const fullPath = resolveMenuFullPath(parentPath, menu.path)
    const routes: RouteRecordRaw[] = []

    if (menu.component) {
        const component = getComponent(menu)
        if (component) {
            routes.push({
                path: fullPath,
                name: buildRouteName(menu, fullPath),
                component,
                meta: {
                    title: menu.name
                }
            })
        } else {
            console.warn(`[routes] component not found: ${menu.component}`)
        }
    }

    if (menu.children?.length) {
        menu.children.forEach(child => {
            routes.push(...createRouteRecord(child, fullPath))
        })
    }

    return routes
}

function menusToRoutes(menus: MenuItem[]): RouteRecordRaw[] {
    return menus.flatMap(menu => createRouteRecord(menu))
}

function findDefaultPath(menus: MenuItem[], parentPath: string = ''): string {
    for (const menu of menus) {
        if (!isValidMenu(menu)) continue
        const fullPath = resolveMenuFullPath(parentPath, menu.path)

        if ((fullPath === '/home' || fullPath === '/') && getComponent(menu)) return fullPath
    }

    for (const menu of menus) {
        if (!isValidMenu(menu)) continue
        const fullPath = resolveMenuFullPath(parentPath, menu.path)

        if (menu.component && getComponent(menu)) return fullPath
        if (menu.children?.length) {
            const childPath = findDefaultPath(menu.children, fullPath)
            if (childPath) return childPath
        }
    }

    return '/home'
}

export async function initRoutes(menusFromLogin?: MenuItem[]): Promise<string> {
    const store = useUserInfoStore()
    const menus = menusFromLogin || store.menus

    if (menusFromLogin) {
        if (addedRouteNames.size > 0) {
            resetRoutes()
        }
        store.setMenus(menus)
    }

    if (addedRouteNames.size > 0) {
        return findDefaultPath(menus)
    }

    const existingPaths = new Set(router.getRoutes().map(route => route.path))
    const dynamicRoutes = menusToRoutes(menus)

    dynamicRoutes.forEach(route => {
        const routeName = String(route.name || '')
        if (!routeName || existingPaths.has(route.path) || router.hasRoute(routeName)) {
            return
        }

        router.addRoute('layout', route)
        existingPaths.add(route.path)
        addedRouteNames.add(routeName)
    })

    return findDefaultPath(menus)
}

export function resetRoutes(): void {
    addedRouteNames.forEach(routeName => {
        if (router.hasRoute(routeName)) {
            router.removeRoute(routeName)
        }
    })

    addedRouteNames.clear()
}

export function hasDynamicRoutes(): boolean {
    return addedRouteNames.size > 0
}

export { findDefaultPath }
