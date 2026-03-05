import Axios from "./index";
let baseUrl = '/api';
/**
 * @description 获取菜单列表
 * @data
*/
export function getMenus(){
    return new Promise((resolve,reject)=>{
        Axios({
            url:baseUrl+'/getMenus',
            needAuth: true, // 需要鉴权
            operationType:'query', // 添加操作类型标识
            method:'get'
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 获取菜单列表
 * @data
*/
export function getMenuTree(){
    return new Promise((resolve,reject)=>{
        Axios({
            url:baseUrl+'/getMenuTree',
            needAuth: true, // 需要鉴权
            operationType:'query', // 添加操作类型标识
            method:'get'
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
/**
 * @description 设置菜单
 * @data {Object} data - 菜单对象
*/
export function setMenu(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:baseUrl+'/setMenu',
            method:'post',
            needAuth: true, // 需要鉴权
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
 * @description 删除菜单
 * @data {Object} data - 菜单对象
*/
export function deleteMenu(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:baseUrl+'/deleteMenu',
            method:'post',
            needAuth: true, // 需要鉴权
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
 * @description 新增菜单
 * @data {Object} data - 菜单对象
*/
export function addMenu(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:baseUrl+'/addMenu',
            method:'post',
            needAuth: true, // 需要鉴权
            operationType:'operate', // 添加操作类型标识
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}