import axios from './index'
import type { ApiResponse } from './types'
import type { MenuItem } from '@/store/pinia/userInfo'

export interface LoginPayload {
    username: string
    password: string
    remember?: boolean
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
 * @description 获取当前用户菜单数据
 */
export const getCurrentUserMenu = (): Promise<ApiResponse<MenuItem[]>> => {
    return axios({
        url: '/auth/getMenus',
        method: 'post'
    })
}
