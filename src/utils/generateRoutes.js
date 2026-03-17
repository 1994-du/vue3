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


async function initRoutes() {
    const userInfoStore = useUserInfoStore()
    const menus = userInfoStore.menus
    const routes = generateRoutes(menus)
    routes.forEach(route => {
        router.addRoute('layout',route)
    })
}
export{
    initRoutes
}