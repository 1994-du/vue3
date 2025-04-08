import axios from 'axios'
import { ElMessage,ElLoading } from 'element-plus'
import router from '../router/index'
let loadingInstance = null
let requestCount = 0
const showLoading = () => {
    if(requestCount === 0){
        loadingInstance = ElLoading.service({
            lock:true,
            text:'加载中...',
            background:'rgba(0,0,0,0.7)'
        })
    }
    requestCount++
}
const hideLoading = () => {
    requestCount--
    if(requestCount === 0 && loadingInstance){
        loadingInstance.close()
    }
}
// 创建axios实例
const Axios = axios.create({
    timeout:300000,
    headers:{
        'Token':JSON.parse(sessionStorage.getItem('token'))?.id||''
    }
})
Axios.interceptors.request.use(config=>{
    console.log('请求拦截器',config);
    
    showLoading()
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json;charset=UTF-8'
    return config
})
Axios.interceptors.response.use(res=>{
    console.log('响应拦截器',res);
    if(res.status===200){
        if(res.data.status==200&&!res.data.code){
            ElMessage({
                message:res.data.message,
                type:'success'
            })
        }
        if(res.data.status!==200){
            ElMessage({
                message:res.data.message,
                type:'error'
            })
        }
    }
    hideLoading()
    return res.data
   
},err=>{
    ElMessage({
        message:err,
        type:'error'
    })
    hideLoading()
}
)

export default Axios;