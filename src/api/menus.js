import Axios from "./index";
let baseUrl = '/api';
export function getMenus(){
    return new Promise((resolve,reject)=>{
        Axios({
            url:baseUrl+'/getMenus',
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
export function setMenus(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:baseUrl+'/setMenus',
            method:'post',
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}