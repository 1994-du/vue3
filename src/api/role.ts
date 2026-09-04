import axios from './index'

/**
 * @description 获取所有角色
 */
export const getRoles = (data: any) => {
    return axios({
        url: '/getRoles',
        method: 'post',
        needAuth: true,
        data
    } as any)
}

/**
 * @description 设置角色
 */
export const setRole = (data: any) => {
    return axios({
        url: '/setRole',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 新增角色
 */
export const addRole = (data: any) => {
    return axios({
        url: '/addRole',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 删除角色
 */
export const delRole = (data: any) => {
    return axios({
        url: '/delRole',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}
