import axios from './index'

/**
 * @description 登录
 */
export const toLogin = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/auth/login',
            method: 'post',
            needAuth: false,
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
 * @description 退出登录
 */
export const toLoginOut = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/auth/logout',
            method: 'post',
            needAuth: false,
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
 * @description 注册
 */
export const toRegistry = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/auth/register',
            method: 'post',
            needAuth: false,
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
 * @description 获取当前用户菜单数据
 */
export const getCurrentUserMenu = () => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/auth/getMenus',
            method: 'post'
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}
