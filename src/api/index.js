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
    showLoading()
    config.headers['Content-Type'] = 'application/json'
    return config
})
Axios.interceptors.response.use(res=>{
    console.log('index',res);
    
    if(res.status===200){
        if(res.data.status==200){
            ElMessage({
                message:res.data.message,
                type:'success'
            })
        }else{
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