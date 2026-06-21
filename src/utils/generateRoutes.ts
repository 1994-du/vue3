import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import useUserInfoStore from '@/store/pinia/userInfo'
import type { MenuItem } from '@/store/pinia/userInfo'
import { resolveMenuFullPath } from '@/utils/menuRoute'

const modules = import.meta.glob('@/views/**/*.vue')
const addedRouteNames = new Set<string>()
const preloadedModulePaths = new Set<string>()
const preloadModulePromises = new Map<string, Promise<unknown>>()

interface PreloadDynamicRoutesOptions {
    excludePath?: string
    concurrency?: number
}

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

function normalizeRoutePath(path: string = ''): string {
    const cleanPath = path.split(/[?#]/)[0] || '/'
    const normalizedPath = '/' + cleanPath.trim().split('/').filter(Boolean).join('/')
    return normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '')
}

function findMenuByPath(menus: MenuItem[], targetPath: string, parentPath: string = ''): MenuItem | null {
    const normalizedTargetPath = normalizeRoutePath(targetPath)

    for (const menu of menus) {
        const fullPath = normalizeRoutePath(resolveMenuFullPath(parentPath, menu.path))

        if (fullPath === normalizedTargetPath) {
            return menu
        }

        if (menu.children?.length) {
            const child = findMenuByPath(menu.children, normalizedTargetPath, fullPath)
            if (child) {
                return child
            }
        }
    }

    return null
}

function preloadMenuComponent(menu: MenuItem): Promise<unknown> | null {
    if (!menu.component) {
        return null
    }

    const componentPath = resolveViewModulePath(menu.component)
    const loader = modules[componentPath]

    if (!loader) {
        return null
    }

    const existingPromise = preloadModulePromises.get(componentPath)
    if (existingPromise) {
        return existingPromise
    }

    if (preloadedModulePaths.has(componentPath)) {
        return Promise.resolve()
    }

    preloadedModulePaths.add(componentPath)
    const preloadPromise = loader()
        .catch(error => {
            preloadedModulePaths.delete(componentPath)
            console.warn(`[dynamic-route] preload failed: ${componentPath}`, error)
        })
        .finally(() => {
            preloadModulePromises.delete(componentPath)
        })

    preloadModulePromises.set(componentPath, preloadPromise)
    return preloadPromise
}

async function runPreloadTasks(tasks: Array<() => Promise<unknown>>, concurrency: number = 4): Promise<void> {
    if (!tasks.length) return

    let taskIndex = 0
    const workerCount = Math.min(Math.max(concurrency, 1), tasks.length)
    const workers = Array.from({ length: workerCount }, async () => {
        while (taskIndex < tasks.length) {
            const task = tasks[taskIndex++]
            await task()
        }
    })

    await Promise.allSettled(workers)
}

async function preloadMenuComponents(menus: MenuItem[], options: PreloadDynamicRoutesOptions = {}): Promise<void> {
    const tasks: Array<() => Promise<unknown>> = []
    const excludePath = options.excludePath ? normalizeRoutePath(options.excludePath) : ''

    const walk = (menuList: MenuItem[], parentPath: string = ''): void => {
        menuList.forEach(menu => {
            const fullPath = normalizeRoutePath(resolveMenuFullPath(parentPath, menu.path))
            if (menu.component && fullPath !== excludePath) {
                tasks.push(() => preloadMenuComponent(menu) || Promise.resolve())
            }

            if (menu.children?.length) {
                walk(menu.children, fullPath)
            }
        })
    }

    walk(menus)
    await runPreloadTasks(tasks, options.concurrency)
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

export async function preloadDynamicRoute(path: string, menusFromLogin?: MenuItem[]): Promise<void> {
    const store = useUserInfoStore()
    const menus = menusFromLogin || store.menus
    const menu = findMenuByPath(menus, path)

    if (!menu) return

    await preloadMenuComponent(menu)
}

export async function preloadDynamicRoutes(menusFromLogin?: MenuItem[], options: PreloadDynamicRoutesOptions = {}): Promise<void> {
    const store = useUserInfoStore()
    const menus = menusFromLogin || store.menus

    if (!menus.length) return

    await preloadMenuComponents(menus, options)
}

export function resetRoutes(): void {
    addedRouteNames.forEach(routeName => {
        if (router.hasRoute(routeName)) {
            router.removeRoute(routeName)
        }
    })

    addedRouteNames.clear()
    preloadedModulePaths.clear()
    preloadModulePromises.clear()
    isInited = false
}

export function hasDynamicRoutes(): boolean {
    return isInited
}

export { findDefaultPath }
