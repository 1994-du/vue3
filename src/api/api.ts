import axios from './index'

/**
 * @description 上传头像
 */
export const toUpload = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/toupload',
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
 * @description 获取用户列表
 */
export const getUsers = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/users/all',
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
 * @description 编辑用户
 */
export const updateUser = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/users/setUser',
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
 * @description 新建用户
 */
export const addUser = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/users/addUser',
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
 * @description 重置用户密码
 */
export const toResetPassword = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/users/resetPassword',
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
 * @description 删除用户
 */
export const delUser = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/users/deleteUser',
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
 * @description 获取角色词典
 */
export const getRolesDict = (data?: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/getRoleDict',
            method: 'get',
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
 * @description 文件分片上传
 */
export const fragmentUpload = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/fragmentUpload',
            method: 'post',
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 文件分片下载
 */
export const fragmentDownload = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/fragmentDownload',
            method: 'post',
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 更新用户头像
 */
export const updateAvatar = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/users/updateAvatar',
            method: 'post',
            needAuth: true,
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            operationType: 'operate'
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 上传文件
 */
export const uploadFile = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/file/upload',
            method: 'post',
            needAuth: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
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
 * @description 获取组织架构树
 */
export const getOrgTree = (data: any = { parentId: 0 }) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/org-structures/tree',
            method: 'post',
            needAuth: true,
            data: {
                parentId: 0,
                ...data
            }
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * @description 获取组织详情
 */
export const getOrgDetail = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/org-structures/detail',
            method: 'get',
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
 * @description 创建组织
 */
export const addOrg = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/org-structures/create',
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
 * @description 更新组织
 */
export const updateOrg = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/org-structures/update',
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
 * @description 删除组织
 */
export const deleteOrg = (data: any) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/org-structures/delete',
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
