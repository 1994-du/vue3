import axios from './index'
import type { ApiResponse } from './types'

type JsonPayload = object

/**
 * @description 获取用户列表
 */
export const getUsers = (data: JsonPayload = {}): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/users/all',
        method: 'post',
        needAuth: true,
        data
    })
}

/**
 * @description 获取当前登录用户信息
 */
export const getCurrentUser = (): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/users/me',
        method: 'get',
        needAuth: true
    })
}

/**
 * @description 编辑用户
 */
export const updateUser = (data: JsonPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/users/setUser',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 新建用户
 */
export const addUser = (data: JsonPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/users/addUser',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 重置用户密码
 */
export const toResetPassword = (data: JsonPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/users/resetPassword',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 删除用户
 */
export const delUser = (data: JsonPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/users/deleteUser',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 获取角色词典
 */
export const getRolesDict = (data?: JsonPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/getRoleDict',
        method: 'get',
        needAuth: true,
        data
    })
}

/**
 * @description 更新用户头像
 */
export const updateAvatar = (data: FormData): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/users/updateAvatar',
        method: 'post',
        needAuth: true,
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        operationType: 'operate'
    })
}

/**
 * @description 上传文件
 */
export const uploadFile = (data: FormData): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/file/upload',
        method: 'post',
        needAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        operationType: 'operate',
        data
    })
}

/**
 * @description 获取组织架构树
 */
export const getOrgTree = (params: JsonPayload = { parentId: 0 }): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/org-structures/tree',
        method: 'get',
        needAuth: true,
        params: {
            parentId: 0,
            ...params
        }
    })
}

/**
 * @description 获取组织详情
 */
export const getOrgDetail = (id: number | string): Promise<ApiResponse<unknown>> => {
    return axios({
        url: `/org-structures/detail/${id}`,
        method: 'get',
        needAuth: true
    })
}

/**
 * @description 创建组织
 */
export const addOrg = (data: JsonPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: '/org-structures/create',
        method: 'post',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 更新组织
 */
export const updateOrg = (id: number | string, data: JsonPayload): Promise<ApiResponse<unknown>> => {
    return axios({
        url: `/org-structures/update/${id}`,
        method: 'put',
        needAuth: true,
        operationType: 'operate',
        data
    })
}

/**
 * @description 删除组织
 */
export const deleteOrg = (id: number | string): Promise<ApiResponse<unknown>> => {
    return axios({
        url: `/org-structures/delete/${id}`,
        method: 'delete',
        needAuth: true,
        operationType: 'operate'
    })
}
