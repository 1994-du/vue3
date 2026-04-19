import { getDefaultRoutePath } from '@/utils/menuRoute'

// 路由分组
export default[
    {
        path:'/',
        redirect:() => getDefaultRoutePath(),
        name:'layout',
        component:()=>import('@/Home.vue')
    },
    {
        path:'/login',
        name:'login',
        component:()=>import('@/views/LoginPage.vue')
    }
]
