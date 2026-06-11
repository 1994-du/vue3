import type { RouteRecordRaw } from 'vue-router'
import { findDefaultPath } from '@/utils/generateRoutes'
import useUserInfoStore from '@/store/pinia/userInfo'

export const ROUTE_MISS_NAME = 'route-miss'

// 路由分组
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: () => findDefaultPath(useUserInfoStore().menus),
        name: 'layout',
        component: () => import('@/Home.vue'),
        children: [
            {
                path:'home',
                name:'home',
                component: () => import('@/views/HomePage.vue')
            }
        ]
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
    },
    {
        path: '/:pathMatch(.*)*',
        name: ROUTE_MISS_NAME,
        component: () => import('@/views/Error.vue')
    }
]

export default routes
