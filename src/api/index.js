import axios from 'axios'
import { ElMessage } from 'element-plus'
const Axios = axios.create({
    timeout:3000
})

Axios.interceptors.request.use(req=>{
    return req
})
Axios.interceptors.response.use(res=>{
    ElMessage({
        message:res.data.msg,
        type:res.data.status
    })
    return res.data
})
export default Axios;