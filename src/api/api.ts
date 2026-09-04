import axios from './index'

/**
 * @description 获取用户列表
 */
export const getUsers = (data: any) => {
    return axios({
        url: '/users/all',
        method: 'post',
        needAuth: true,
        data
    } as any)
}

/**
 * @description 获取当前登录用户信息
 */
export const getCurrentUser = () => {
    return axios({
        baseURL: '',
        url: '/api/users/me',
        method: 'get',
        needAuth: true
    } as any)
}

/**
 * @description 编辑用户
 */
export const updateUser = (data: any) => {
    return axios({
        url: '/users/setUser',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 新建用户
 */
export const addUser = (data: any) => {
    return axios({
        url: '/users/addUser',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 重置用户密码
 */
export const toResetPassword = (data: any) => {
    return axios({
        url: '/users/resetPassword',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 删除用户
 */
export const delUser = (data: any) => {
    return axios({
        url: '/users/deleteUser',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 获取角色词典
 */
export const getRolesDict = (data?: any) => {
    return axios({
        url: '/getRoleDict',
        method: 'get',
        needAuth: true,
        data
    } as any)
}

/**
 * @description 更新用户头像
 */
export const updateAvatar = (data: any) => {
    return axios({
        url: '/users/updateAvatar',
        method: 'post',
        needAuth: true,
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        operationType: 'operate'
    } as any)
}

/**
 * @description 上传文件
 */
export const uploadFile = (data: any) => {
    return axios({
        url: '/file/upload',
        method: 'post',
        needAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 获取组织架构树
 */
export const getOrgTree = (params: any = { parentId: 0 }) => {
    return axios({
        url: '/org-structures/tree',
        method: 'get',
        needAuth: true,
        params: {
            parentId: 0,
            ...params
        }
    } as any)
}

/**
 * @description 获取组织详情
 */
export const getOrgDetail = (id: number | string) => {
    return axios({
        url: `/org-structures/detail/${id}`,
        method: 'get',
        needAuth: true
    } as any)
}

/**
 * @description 创建组织
 */
export const addOrg = (data: any) => {
    return axios({
        url: '/org-structures/create',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 更新组织
 */
export const updateOrg = (id: number | string, data: any) => {
    return axios({
        url: `/org-structures/update/${id}`,
        method: 'put',
        needAuth: true,
        operationType: 'operate',
        data
    } as any)
}

/**
 * @description 删除组织
 */
export const deleteOrg = (id: number | string) => {
    return axios({
        url: `/org-structures/delete/${id}`,
        method: 'delete',
        needAuth: true,
        operationType: 'operate'
    } as any)
}
