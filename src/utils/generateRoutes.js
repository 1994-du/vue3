import router from '@/router'
import useUserInfoStore from '@/store/pinia/userInfo.js'

const modules = import.meta.glob('@/views/**/*.vue')
console.log('----',modules);
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
//   const menus = await getMenuList() // 请求后端菜单
//   userInfoStore.setMenus(menus)
    const userInfoStore = useUserInfoStore()
    const menus = userInfoStore.menus
    const routes = generateRoutes(menus)
    console.log('----2',routes);
    routes.forEach(route => {
        router.addRoute(route)
    })
}
export{
    initRoutes
}