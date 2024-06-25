import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router/index'
// 创建axios实例
const Axios = axios.create({
    timeout:300000,
    headers:{
        'Token':JSON.parse(sessionStorage.getItem('token'))?.id||''
    }
})
Axios.interceptors.request.use(req=>{
    return req
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