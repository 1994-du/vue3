const HOME_FALLBACK_PATH = '/home'

function normalizeRoutePath(path = '') {
    if (typeof path !== 'string') {
        return ''
    }

    const segments = path
        .trim()
        .split('/')
        .filter(Boolean)

    return segments.length ? `/${segments.join('/')}` : ''
}

function toChildRoutePath(path = '') {
    return normalizeRoutePath(path).replace(/^\/+/, '')
}

function getRouteSegments(path = '') {
    return normalizeRoutePath(path)
        .split('/')
        .filter(Boolean)
}

function resolveMenuFullPath(parentPath = '', currentPath = '') {
    const normalizedParentPath = normalizeRoutePath(parentPath)
    const normalizedCurrentPath = normalizeRoutePath(currentPath)

    if (!normalizedParentPath) {
        return normalizedCurrentPath
    }

    if (!normalizedCurrentPath) {
        return normalizedParentPath
    }

    if (
        normalizedCurrentPath === normalizedParentPath ||
        normalizedCurrentPath.startsWith(`${normalizedParentPath}/`)
    ) {
        return normalizedCurrentPath
    }

    if (getRouteSegments(normalizedCurrentPath).length > 1) {
        return normalizedCurrentPath
    }

    return normalizeRoutePath(`${normalizedParentPath}/${normalizedCurrentPath}`)
}

function getRelativeRoutePath(fullPath = '', parentPath = '') {
    const normalizedFullPath = normalizeRoutePath(fullPath)
    const normalizedParentPath = normalizeRoutePath(parentPath)

    if (!normalizedParentPath) {
        return toChildRoutePath(normalizedFullPath)
    }

    if (!normalizedFullPath || normalizedFullPath === normalizedParentPath) {
        return ''
    }

    if (normalizedFullPath.startsWith(`${normalizedParentPath}/`)) {
        return normalizedFullPath.slice(normalizedParentPath.length + 1)
    }

    return toChildRoutePath(normalizedFullPath)
}

function normalizeComponentPath(component = '') {
    if (typeof component !== 'string') {
        return ''
    }

    const normalizedComponent = component
        .trim()
        .replace(/^\/+/, '')
        .replace(/\.vue$/i, '')

    return normalizedComponent ? `/src/views/${normalizedComponent}.vue` : ''
}

function getPersistedMenus() {
    if (typeof window === 'undefined') {
        return []
    }

    const rawMenus = window.localStorage.getItem('menus')
    if (!rawMenus) {
        return []
    }

    try {
        const parsedMenus = JSON.parse(rawMenus)

        if (Array.isArray(parsedMenus)) {
            return parsedMenus
        }

        if (Array.isArray(parsedMenus?.menus)) {
            return parsedMenus.menus
        }
    } catch (error) {
        console.warn('解析本地菜单数据失败:', error)
    }

    return []
}

function findMenuPath(menus = [], matcher) {
    for (const menu of menus) {
        const normalizedPath = normalizeRoutePath(menu?.path)

        if (normalizedPath && matcher(menu, normalizedPath)) {
            return normalizedPath
        }

        if (Array.isArray(menu?.children) && menu.children.length) {
            const childPath = findMenuPath(menu.children, matcher)
            if (childPath) {
                return childPath
            }
        }
    }

    return ''
}

function findFirstRoutePath(menus = []) {
    return findMenuPath(menus, (menu) => {
        return !!menu?.component || !Array.isArray(menu?.children) || menu.children.length === 0
    })
}

function getDefaultRoutePath(menus = []) {
    const menuList = Array.isArray(menus) && menus.length ? menus : getPersistedMenus()

    return (
        findMenuPath(menuList, (_, normalizedPath) => normalizedPath === HOME_FALLBACK_PATH) ||
        findFirstRoutePath(menuList) ||
        HOME_FALLBACK_PATH
    )
}

export {
    HOME_FALLBACK_PATH,
    getDefaultRoutePath,
    getRelativeRoutePath,
    normalizeComponentPath,
    normalizeRoutePath,
    resolveMenuFullPath,
    toChildRoutePath
}
