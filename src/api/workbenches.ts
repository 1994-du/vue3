import axios from './index'
import type { ApiResponse } from './types'

export interface WorkbenchPayload {
    name: string
    icon: string
    link: string
    userIds: Array<number | string>
}

/**
 * @description 获取工作台管理列表
 */
export const getWorkbenches = (): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/workbenches/list',
        method: 'get',
        needAuth: true,
        operationType: 'query'
    })
}

/**
 * @description 获取当前登录用户所属工作台子应用
 */
export const getCurrentWorkbenches = (): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/workbenches/current/list',
        method: 'get',
        needAuth: true,
        operationType: 'query'
    })
}

/**
 * @description 新增工作台子应用
 */
export const createWorkbench = (data: WorkbenchPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/workbenches/create',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 编辑工作台子应用
 */
export const updateWorkbench = (id: number | string, data: WorkbenchPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: `/workbenches/update/${id}`,
        method: 'put',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 删除工作台子应用
 */
export const deleteWorkbench = (id: number | string): Promise<ApiResponse<unknown>> => {
    return axios({
        url: `/workbenches/delete/${id}`,
        method: 'delete',
        needAuth: true,
        operationType: 'operate'
    })
}
