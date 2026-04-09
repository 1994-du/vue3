import Axios from "./index";
let baseUrl = '/api';

/**
 * @description 上传头像
 * @data 
*/
export function toUpload(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/toupload`,
            method:'post',
            needAuth: true, // 上传头像需要鉴权
            operationType:'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 获取用户列表
 * @data
*/
export function getUsers(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/users/all`,
            method:'post',
            needAuth: true, // 需要鉴权
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 编辑用户
 * @data
*/
export function updateUser(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/users/setUser`,
            method:'post',
            needAuth: true, // 需要鉴权
            operationType: 'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 新建用户
 * @param {Object} data - 用户数据
 * @param {string} data.username - 用户名
 * @param {string} data.avatar - 头像
 * @param {number} data.roleId - 角色id
*/
export function addUser(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/users/addUser`,
            method:'post',
            needAuth: true, // 需要鉴权
            operationType: 'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 重置用户密码
 * @param {number} userId - 用户id
*/
export function toResetPassword(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/users/resetPassword`,
            method:'post',
            needAuth:true,
            operationType: 'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 删除用户
 * @data
*/
export function delUser(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/users/deleteUser`,
            method:'post',
            needAuth: true, // 需要鉴权
            operationType: 'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 获取角色词典
 * @data
*/
export function getRolesDict(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/getRoleDict`,
            method:'get',
            needAuth: true, // 需要鉴权
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 文件分片上传
 * @data
*/
export function fragmentUpload(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/fragmentUpload`,
            method:'post',
            data,
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 文件分片下载
 * @data
*/
export function fragmentDownload(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/fragmentDownload`,
            method:'post',
            data
        },{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 更新用户头像
 * @data {FormData} data - 包含头像文件的FormData对象
 */
export function updateAvatar(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/users/updateAvatar`,
            method:'post',
            needAuth: true, // 需要鉴权
            data,
            headers:{
                'Content-Type':'multipart/form-data'
            },
            operationType: 'operate' // 添加操作类型标识
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 上传文件
 * @param {FormData} data - 包含文件的FormData对象
*/
export function uploadFile(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/file/upload`,
            method:'post',
            needAuth: true, // 需要鉴权
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            operationType: 'operate',
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 获取组织架构树
 * @param {Object} data - 请求参数
 * @param {number} data.parentId - 父级组织id，默认为0
*/
export function getOrgTree(data = { parentId: 0 }){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/org-structures/tree`,
            method:'post',
            needAuth: true, // 需要鉴权
            data: {
                parentId: 0,
                ...data
            }
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 获取组织详情
 * @param {number} id - 组织id
*/
export function getOrgDetail(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/org-structures/detail`,
            method:'get',
            needAuth: true, // 需要鉴权
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 新增组织
 * @param {Object} data - 组织数据
 * @param {string} data.name - 组织名称
 * @param {string} data.code - 组织编码
 * @param {number} data.parentId - 父级组织id
 * @param {number} data.sort - 排序
 * @param {number} data.status - 状态
 * @param {string} data.remark - 备注
*/
/**
 * @description 创建组织结构
 * @param {Object} data - 组织数据
 * @param {string} data.name - 组织名称
 * @param {string} data.code - 组织编码
 * @param {number} data.parentId - 父级组织id
 * @param {number} data.sort - 排序
 * @param {number} data.status - 状态
 * @param {string} data.remark - 备注
*/
export function addOrg(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/org-structures/create`,
            method:'post',
            needAuth: true, // 需要鉴权
            operationType: 'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 更新组织
 * @param {Object} data - 组织数据
 * @param {number} data.id - 组织id
 * @param {string} data.name - 组织名称
 * @param {string} data.code - 组织编码
 * @param {number} data.sort - 排序
 * @param {number} data.status - 状态
 * @param {string} data.remark - 备注
*/
export function updateOrg(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/org-structures/update`,
            method:'post',
            needAuth: true, // 需要鉴权
            operationType: 'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 删除组织
 * @param {number} id - 组织id
*/
export function deleteOrg(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/org-structures/delete`,
            method:'post',
            needAuth: true, // 需要鉴权
            operationType: 'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
