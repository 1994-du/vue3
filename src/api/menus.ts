import axios from './index'

/**
 * @description 获取菜单列表
 */
export const getMenus = () => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/getMenus',
            method: 'get',
            needAuth: true,
            operationType: 'query'
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 获取菜单树
 */
export const getMenuTree = () => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/getMenuTree',
            method: 'get',
            needAuth: true,
            operationType: 'query'
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 设置菜单
 */
export const setMenu = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/setMenu',
            method: 'post',
            needAuth: true,
            operationType: 'operate',
            data
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 删除菜单
 */
export const deleteMenu = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/deleteMenu',
            method: 'post',
            needAuth: true,
            operationType: 'operate',
            data
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 新增菜单
 */
export const addMenu = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/addMenu',
            method: 'post',
            needAuth: true,
            operationType: 'operate',
            data
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}
