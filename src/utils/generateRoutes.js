import router from '@/router'
import useUserInfoStore from '@/store/pinia/userInfo.js'
const modules = import.meta.glob('@/views/**/*.vue')

function generateRoutes(menus) {
    const routes = []
    menus.forEach(menu => {
        const route = {
            path: menu.path,
            name: menu.name
        }
        // 如果有组件
        if (menu.component) {
            const componentPath = `/src/views/${menu.component}.vue`
            route.component = modules[componentPath]
        }
        // 递归 children
        if (menu.children && menu.children.length) {
            route.children = generateRoutes(menu.children)
        }
        routes.push(route)
    })
    return routes
}

// 从菜单中找到默认路由路径
function getDefaultRoutePath(menus) {
    if (!menus || menus.length === 0) {
        return '/'
    }
    
    // 优先选择首页
    for (const menu of menus) {
        if (menu.path === '/home' || menu.path === '/') {
            return menu.path
        }
    }
    
    // 否则返回第一个有组件的菜单
    for (const menu of menus) {
        if (menu.component) {
            return menu.path
        }
        if (menu.children && menu.children.length) {
            const childPath = getDefaultRoutePath(menu.children)
            if (childPath) {
                return childPath
            }
        }
    }
    
    return '/'
}

async function initRoutes(menusFromLogin) {
    let menus = []
    const userInfoStore = useUserInfoStore()
    
    if (menusFromLogin && menusFromLogin.length > 0) {
        menus = menusFromLogin
        userInfoStore.setMenus(menus)
    } else if (localStorage.getItem('token')) {
        // 只从 store 中获取菜单数据，不调用 API
        if (userInfoStore.menus && userInfoStore.menus.length > 0) {
            menus = userInfoStore.menus
        }
    }
    
    const routes = generateRoutes(menus)
    routes.forEach(route => {
        router.addRoute('layout',route)
    })
    
    return getDefaultRoutePath(menus)
}
export{
    initRoutes
}