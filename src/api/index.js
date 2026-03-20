import axios from 'axios'
import { ElMessage,ElLoading } from 'element-plus'
import { handleTokenExpire } from '@/utils/tokenManager'
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
// 使用从tokenManager导入的函数进行token管理

// 创建axios实例
const Axios = axios.create({
    timeout:300000
})

// 请求拦截器
Axios.interceptors.request.use(config=>{
    const needAuth = config.needAuth !== false; // 默认值为true
    if (needAuth) {
        // 添加token到请求头
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    // 清理自定义参数，不传递给服务器
    delete config.needAuth; 
    showLoading()
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json;charset=UTF-8'
    return config
})
Axios.interceptors.response.use(res=>{
    console.log('响应数据',res)
    // 处理token过期的特定状态码（例如401或特定的错误码）
    if (res.status === 401 || res.data.code === 401 || res.data.status === 401) {
        handleTokenExpire();
        return Promise.reject(new Error('token已过期'));
    }
    const operationType = res.config.operationType || '';   
    // 需要显示消息的操作类型列表
    const showMessageOperations = ['operate'];
    if(res.status===200){
        // 只有在特定操作类型时才显示成功消息
        if(res.data.code===200 && showMessageOperations.includes(operationType)){
            ElMessage({
                message:res.data.msg,
                type:'success'
            })
        }
        // 错误消息仍然全部显示，以便用户了解错误
        if(res.data.code!==200){
            ElMessage({
                message:res.data.msg,
                type:'error'
            })
        }
    }
    
    // 清理自定义参数，不传递给服务器
    delete res.config.operationType;
    
    hideLoading()
    return res.data
   
},err=>{
    console.log('响应错误',err)
    // 处理网络错误中的401情况
    if (err.response && err.response.status === 401||err.status===400) {
        handleTokenExpire();
    } else {
        ElMessage({
            message: err.response.data.msg || '请求失败',
            type: 'error'
        });
    }
    hideLoading();
    return Promise.reject(err);
}
)

export default Axios;