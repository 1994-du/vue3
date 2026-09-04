import axios from './index'

export interface WorkbenchPayload {
    name: string
    icon: string
    link: string
    userIds: Array<number | string>
}

/**
 * @description 获取工作台管理列表
 */
export const getWorkbenches = () => {
    return axios({
        baseURL: '',
        url: '/api/workbenches/list',
        method: 'get',
        needAuth: true,
        operationType: 'query'
    } as any)
}

/**
 * @description 获取当前登录用户所属工作台子应用
 */
export const getCurrentWorkbenches = () => {
    return axios({
        baseURL: '',
        url: '/api/workbenches/current/list',
        method: 'get',
        needAuth: true,
        operationType: 'query'
    } as any)
}

/**
 * @description 新增工作台子应用
 */
export const createWorkbench = (data: WorkbenchPayload) => {
    return axios({
        baseURL: '',
        url: '/api/workbenches/create',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 编辑工作台子应用
 */
export const updateWorkbench = (id: number | string, data: WorkbenchPayload) => {
    return axios({
        baseURL: '',
        url: `/api/workbenches/update/${id}`,
        method: 'put',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 删除工作台子应用
 */
export const deleteWorkbench = (id: number | string) => {
    return axios({
        baseURL: '',
        url: `/api/workbenches/delete/${id}`,
        method: 'delete',
        needAuth: true,
        operationType: 'operate'
    } as any)
}
