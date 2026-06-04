import axios from './index'

/**
 * @description 获取所有角色
 */
export const getRoles = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/getRoles',
            method: 'post',
            needAuth: true,
            data
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 设置角色
 */
export const setRole = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/setRole',
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
 * @description 新增角色
 */
export const addRole = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/addRole',
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
 * @description 删除角色
 */
export const delRole = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/delRole',
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
