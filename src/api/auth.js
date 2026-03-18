import Axios from "./index";
let baseUrl = '/api';
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
            operationType:'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/***
 * @description 退出登录
 * @data 
*/
export function toLoginOut(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/auth/logout`,
            method:'post',
            needAuth: false, // 登录接口不需要鉴权
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
 * @description 注册
 * @data 
*/
export function toRegistry(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/auth/register`,
            method:'post',
            needAuth: false, // 注册接口不需要鉴权
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
 * @description: 获取当前用户菜单数据
 * @return {*}
*/
export const getCurrentUserMenu = () => {
    return new Promise((resolve, reject) => {
        Axios({
            url: baseUrl + '/auth/getMenus',
            method: 'post',
        }).then(res => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
    });
}
