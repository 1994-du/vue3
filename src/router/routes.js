// 路由分组
export default[
    {
        path:'/',
        redirect:'/home',
        name:'layout',
        component:()=>import('@/Home.vue')
    },
    {
        path:'/login',
        name:'login',
        component:()=>import('@/views/LoginPage.vue')
    }
]