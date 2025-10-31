/**
 * @description 上传文件
 * @data {FormData} data - 包含文件的FormData对象
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
            data
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}