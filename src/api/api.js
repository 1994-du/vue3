import Axios from "./index";
let baseUrl;
if(process.env.NODE_ENV=='development'){
    baseUrl='/api'
}else{
    baseUrl=''
}
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
export function toUpload(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/toupload`,
            method:'post',
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
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