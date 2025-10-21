import Axios from "./index";
let baseUrl;
if(process.env.NODE_ENV=='development'){
    baseUrl='/api'
}else{
    baseUrl='http://192.168.31.65:1234'
}
/**
 * @description 登录
 * @data 
*/
export function toLogin(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/auth/login`,
            method:'post',
            needAuth: false, // 登录接口不需要鉴权
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 注册
 * @data 
*/
export function toRegistry(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/auth/register`,
            method:'post',
            needAuth: false, // 注册接口不需要鉴权
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 重置密码
 * @data 
*/
export function toResetPassword(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/auth/reset-password`,
            method:'post',
            needAuth: true, // 重置密码接口需要鉴权
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

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
            url:`${baseUrl}/setUser`,
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
 * @description 新建用户
*/
export function addUser(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/addUser`,
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
 * @description 删除用户
 * @data
*/
export function delUser(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/deleteUser`,
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
 * @description 获取所有角色
 * @data
*/
export function getRoles(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/getRoles`,
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
 * @description 设置角色
 * @data
*/
export function setRoles(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/setRoles`,
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
 * @data
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
            }
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}