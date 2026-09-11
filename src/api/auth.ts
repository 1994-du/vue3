import axios from './index'
import type { ApiResponse } from './types'
import type { MenuItem } from '@/store/pinia/userInfo'

export interface LoginPayload {
    username: string
    password: string
    remember?: boolean
}

export interface LoginData {
    token: string
    menus: MenuItem[]
    username: string
    avatar?: string
}

export interface RegisterPayload {
    username: string
    password: string
}

/**
 * @description 登录
 */
export const toLogin = (data: LoginPayload): Promise<ApiResponse<LoginData>> => {
    return axios({
        url: '/auth/login',
        method: 'post',
        needAuth: false,
        operationType: 'operate',
        data
    }) as Promise<ApiResponse<LoginData>>
}

/**
 * @description 退出登录
 */
export const toLoginOut = (data: LoginPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/auth/logout',
        method: 'post',
        needAuth: false,
        operationType: 'operate',
        data
    })
}

/**
 * @description 注册
 */
export const toRegistry = (data: RegisterPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/auth/register',
        method: 'post',
        needAuth: false,
        operationType: 'operate',
        data
    })
}

/**
 * @description 获取当前用户菜单数据
 */
export const getCurrentUserMenu = (): Promise<ApiResponse<MenuItem[]>> => {
    return axios({
        url: '/auth/getMenus',
        method: 'post'
    })
}
