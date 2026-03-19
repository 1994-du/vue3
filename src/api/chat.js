import Axios from "./index";
let baseUrl = '/api';
/**
 * @description 聊天
 * @data 
 */
export function toChatDeepSeek(data){
    return new Promise((resolve,reject)=>{
        Axios({
            url:`${baseUrl}/deepseek/chat`,
            method:'post',
            needAuth: true, // 聊天接口需要鉴权
            operationType:'operate', // 聁�天接口需要鉴权
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
