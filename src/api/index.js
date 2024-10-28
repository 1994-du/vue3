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
    if(res.data.status){
        if(res.data.status == 'success'){
            ElMessage({
                message:res.data.message,
                type:res.data.status
            })
            return res.data
        }
    }
})

export default Axios;