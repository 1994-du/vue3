import axios from './index'
import type { ApiResponse } from './types'

type RolePayload = Record<string, unknown>

/**
 * @description 获取所有角色
 */
export const getRoles = (data: RolePayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/getRoles',
        method: 'post',
        needAuth: true,
        data
    })
}

/**
 * @description 设置角色
 */
export const setRole = (data: RolePayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/setRole',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 新增角色
 */
export const addRole = (data: RolePayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/addRole',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 删除角色
 */
export const delRole = (data: RolePayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/delRole',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}
