import Axios from "./index";
let baseUrl;
if(process.env.NODE_ENV=='development'){
    baseUrl='/api'
}else{
    baseUrl='http://localhost:1234'
}
/**
 * @description 登录
 * @data 
*/
export function toLogin(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/tologin`,
            method:'post',
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
            url:`${baseUrl}/toregistry`,
            method:'post',
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

/**
 * @description 获取历史头像
 * @data 
*/
export function toQueryHistoryAvatar(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/historyAvatar`,
            method:'post',
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
            data,
            
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
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}