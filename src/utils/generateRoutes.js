import router from '@/router'
import { getCurrentUserMenu } from '@/api/auth'
import {
    HOME_FALLBACK_PATH,
    getDefaultRoutePath,
    getRelativeRoutePath,
    normalizeComponentPath,
    normalizeRoutePath,
    resolveMenuFullPath,
    toChildRoutePath
} from './menuRoute'

const modules = import.meta.glob('/src/views/**/*.vue')

function resolveRouteComponent(menu, normalizedPath) {
    const componentPath = normalizeComponentPath(menu?.component)

    if (componentPath && modules[componentPath]) {
        return modules[componentPath]
    }

    if (normalizedPath === HOME_FALLBACK_PATH) {
        return modules['/src/views/HomePage.vue']
    }

    return undefined
}

function generateRoutes(menus = [], parentPath = '') {
    const routes = []

    menus.forEach(menu => {
        const fullPath = resolveMenuFullPath(parentPath, menu?.path)
        const children = menu?.children?.length ? generateRoutes(menu.children, fullPath) : []
        const routePath = getRelativeRoutePath(fullPath, parentPath)

        if (!routePath && !children.length) {
            return
        }

        const route = {
            path: routePath,
            name: menu.name || routePath
        }

        const component = resolveRouteComponent(menu, fullPath)
        if (component) {
            route.component = component
        }

        if (children.length) {
            route.children = children
        }

        if (!route.component && !route.children?.length) {
            return
        }

        routes.push(route)
    })

    return routes
}

function hasRoutePath(routeList, targetPath, parentPath = '') {
    return routeList.some(route => {
        const currentPath = normalizeRoutePath(
            parentPath ? `${parentPath}/${route.path}` : route.path
        )

        if (currentPath === targetPath) {
            return true
        }

        if (route.children?.length) {
            return hasRoutePath(route.children, targetPath, currentPath)
        }

        return false
    })
}

function addDynamicRoutes(routes) {
    const existedPaths = new Set(
        router.getRoutes().map(route => normalizeRoutePath(route.path))
    )

    routes.forEach(route => {
        const normalizedPath = normalizeRoutePath(route.path)

        if (existedPaths.has(normalizedPath)) {
            return
        }

        router.addRoute('layout', route)
        existedPaths.add(normalizedPath)
    })
}

async function initRoutes(menusFromLogin) {
    let menus = []

    if (menusFromLogin && menusFromLogin.length > 0) {
        menus = menusFromLogin
    } else if (localStorage.getItem('token')) {
        let res = await getCurrentUserMenu()
        if (res.code === 200) {
            menus = res.data.menus
        }
    }

    const routes = generateRoutes(menus)
    const defaultRoutePath = getDefaultRoutePath(menus)

    if (!hasRoutePath(routes, defaultRoutePath)) {
        routes.unshift({
            path: toChildRoutePath(defaultRoutePath),
            name: 'home',
            component: modules['/src/views/HomePage.vue']
        })
    }

    addDynamicRoutes(routes)

    return defaultRoutePath
}

export{
    initRoutes
}
