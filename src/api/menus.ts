import axios from './index'
import type { ApiResponse } from './types'

type MenuPayload = Record<string, unknown>

/**
 * @description 获取菜单列表
 */
export const getMenus = (): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/getMenus',
        method: 'get',
        needAuth: true,
        operationType: 'query'
    })
}

/**
 * @description 获取菜单树
 */
export const getMenuTree = (): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/getMenuTree',
        method: 'get',
        needAuth: true,
        operationType: 'query'
    })
}

/**
 * @description 设置菜单
 */
export const setMenu = (data: MenuPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/setMenu',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 删除菜单
 */
export const deleteMenu = (data: MenuPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/deleteMenu',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 新增菜单
 */
export const addMenu = (data: MenuPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/addMenu',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}
