import { createRouter, createWebHistory } from 'vue-router'
import { getToken, isTokenExpired, handleTokenExpire, setupTokenExpiryCheck } from '@/utils/tokenManager'
import { initRoutes, findDefaultPath } from '@/utils/generateRoutes'
import useUserInfoStore from '@/store/pinia/userInfo'
import routes from './routes'

const WHITE_LIST = ['/login', '/error', '/web-office']

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})


export default router
