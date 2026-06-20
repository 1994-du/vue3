import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import useUserInfoStore from '@/store/pinia/userInfo'
import type { MenuItem } from '@/store/pinia/userInfo'
import { resolveMenuFullPath } from '@/utils/menuRoute'

const modules = import.meta.glob('@/views/**/*.vue')
const addedRouteNames = new Set<string>()
const preloadedModulePaths = new Set<string>()

function buildRouteName(menu: MenuItem, fullPath: string): string {
    return menu.name || fullPath
}

function createRouteRecord(menu: MenuItem, parentPath: string = ''): RouteRecordRaw[] {
    const fullPath = resolveMenuFullPath(parentPath, menu.path)
    const routes: RouteRecordRaw[] = []

    if (menu.component) {
        const componentPath = `/src/views/${menu.component}.vue`
        const component = modules[componentPath]

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
            console.warn(`[dynamic-route] view not found: ${componentPath}`)
        }
    }

    if (menu.children?.length) {
        menu.children.forEach(child => {
            routes.push(...createRouteRecord(child, fullPath))
        })
    }

    return routes
}

function resolveViewModulePath(component?: string): string {
    return component ? `/src/views/${component}.vue` : ''
}

function preloadMenuComponent(menu: MenuItem): Promise<unknown> | null {
    if (!menu.component) {
        return null
    }

    const componentPath = resolveViewModulePath(menu.component)
    const loader = modules[componentPath]

    if (!loader || preloadedModulePaths.has(componentPath)) {
        return null
    }

    preloadedModulePaths.add(componentPath)
    return loader().catch(error => {
        preloadedModulePaths.delete(componentPath)
        console.warn(`[dynamic-route] preload failed: ${componentPath}`, error)
    })
}

async function preloadMenuComponents(menus: MenuItem[]): Promise<void> {
    const tasks: Promise<unknown>[] = []

    const walk = (menuList: MenuItem[]): void => {
        menuList.forEach(menu => {
            const task = preloadMenuComponent(menu)
            if (task) {
                tasks.push(task)
            }

            if (menu.children?.length) {
                walk(menu.children)
            }
        })
    }

    walk(menus)

    if (tasks.length) {
        await Promise.allSettled(tasks)
    }
}

function menusToRoutes(menus: MenuItem[]): RouteRecordRaw[] {
    return menus.flatMap(menu => createRouteRecord(menu))
}

function findDefaultPath(menus: MenuItem[], parentPath: string = ''): string {
    for (const menu of menus) {
        const fullPath = resolveMenuFullPath(parentPath, menu.path)

        if (fullPath === '/home') return '/home'
        if (fullPath === '/') return '/'
    }

    for (const menu of menus) {
        const fullPath = resolveMenuFullPath(parentPath, menu.path)

        if (menu.component) return fullPath
        if (menu.children?.length) {
            const childPath = findDefaultPath(menu.children, fullPath)
            if (childPath) return childPath
        }
    }

    return '/home'
}

let isInited = false

export async function initRoutes(menusFromLogin?: MenuItem[]): Promise<string> {
    const store = useUserInfoStore()
    const menus = menusFromLogin || store.menus

    if (!menus.length) return '/login'

    if (menusFromLogin) {
        store.setMenus(menus)
    }

    if (isInited) {
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

    isInited = true
    return findDefaultPath(menus)
}

export async function preloadDynamicRoutes(menusFromLogin?: MenuItem[]): Promise<void> {
    const store = useUserInfoStore()
    const menus = menusFromLogin || store.menus

    if (!menus.length) return

    await preloadMenuComponents(menus)
}

export function resetRoutes(): void {
    addedRouteNames.forEach(routeName => {
        if (router.hasRoute(routeName)) {
            router.removeRoute(routeName)
        }
    })

    addedRouteNames.clear()
    preloadedModulePaths.clear()
    isInited = false
}

export function hasDynamicRoutes(): boolean {
    return isInited
}

export { findDefaultPath }
