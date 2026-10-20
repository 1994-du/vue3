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

export interface CurrentUserProfile {
    userId?: number | null
    username?: string
    avatar?: string
    roleId?: number | null
    roleName?: string
    gender?: string
    menus: MenuItem[]
}

/**
 * @description 获取当前登录用户完整信息（菜单按角色过滤 + 用户名/头像/角色）
 */
export const getCurrentUserProfile = (): Promise<ApiResponse<CurrentUserProfile>> => {
    return axios({
        url: '/auth/me',
        method: 'get'
    })
}
