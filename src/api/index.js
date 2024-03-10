import axios from 'axios'
import { ElMessage } from 'element-plus'
const Axios = axios.create({
    timeout:300000,
    headers:{
        'Token':JSON.parse(sessionStorage.getItem('token'))?.id||''
    }
})
Axios.interceptors.request.use(req=>{
    console.log('req',req);
    return req
})
Axios.interceptors.response.use(res=>{
    if(res.data.msg){
        ElMessage({
            message:res.data.msg,
            type:res.data.status
        })
    }
    
    return res.data
})

export default Axios;