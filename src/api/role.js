import Axios from "./index";
let baseUrl = '/api';
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
 * @description 设置角色
 * @data
*/
export function setRole(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/setRole`,
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