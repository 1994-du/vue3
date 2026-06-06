// 菜单路径工具（仅保留菜单组件使用的函数）

function normalizePath(path: string = ''): string {
    if (typeof path !== 'string') return ''
    return '/' + path.trim().split('/').filter(Boolean).join('/')
}

// 解析菜单完整路径（父路径 + 当前路径）
export function resolveMenuFullPath(parentPath: string = '', currentPath: string = ''): string {
    const p = normalizePath(parentPath)
    const c = normalizePath(currentPath)
    if (!p) return c
    if (!c) return p
    if (c === p || c.startsWith(p + '/')) return c
    // 单级路径拼接到父路径下
    if (c.split('/').filter(Boolean).length === 1) {
        return normalizePath(p + '/' + c)
    }
    return c
}
