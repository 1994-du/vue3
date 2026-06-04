import type { RouteRecordRaw } from 'vue-router'

// 路由分组
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: () => '/home',
        name: 'layout',
        component: () => import('@/Home.vue'),
        children: []
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginPage.vue')
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('@/views/Error.vue')
    }
]

export default routes
