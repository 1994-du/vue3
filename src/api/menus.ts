import axios from './index'

/**
 * @description 获取菜单列表
 */
export const getMenus = () => {
    return axios({
        url: '/getMenus',
        method: 'get',
        needAuth: true,
        operationType: 'query'
    } as any)
}

/**
 * @description 获取菜单树
 */
export const getMenuTree = () => {
    return axios({
        url: '/getMenuTree',
        method: 'get',
        needAuth: true,
        operationType: 'query'
    } as any)
}

/**
 * @description 设置菜单
 */
export const setMenu = (data: any) => {
    return axios({
        url: '/setMenu',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 删除菜单
 */
export const deleteMenu = (data: any) => {
    return axios({
        url: '/deleteMenu',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 新增菜单
 */
export const addMenu = (data: any) => {
    return axios({
        url: '/addMenu',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}
