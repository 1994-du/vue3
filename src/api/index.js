import axios from 'axios'
import { ElMessage,ElLoading, ElMessageBox } from 'element-plus'
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
// 检查token是否过期
const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    const expireTime = localStorage.getItem('tokenExpireTime');
    
    if (!token || !expireTime) return true;
    
    return Date.now() > parseInt(expireTime);
}

// 清除token
const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpireTime');
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
}

// token过期处理
const handleTokenExpire = () => {
    // 使用ElMessageBox确认对话框
    ElMessageBox.confirm(
        'Token已过期，请重新登录',
        '登录过期',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        // 用户点击确定，清除token并跳转到登录页
        clearToken();
        router.replace('/login');
    }).catch(() => {
        // 用户点击取消，也清除token并跳转（防止绕过登录）
        clearToken();
        router.replace('/login');
    });
}

// 创建axios实例
const Axios = axios.create({
    timeout:300000
})

// 请求拦截器
Axios.interceptors.request.use(config=>{
    console.log('请求拦截器',config);
    
    // 根据needAuth标识判断是否需要鉴权
    // 默认需要鉴权，除非明确设置needAuth: false
    const needAuth = config.needAuth !== false; // 默认值为true
    
    if (needAuth) {
        // 需要鉴权的接口，检查token是否过期
        if (isTokenExpired()) {
            handleTokenExpire();
            return Promise.reject(new Error('token已过期，请重新登录'));
        }
        
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
    console.log('响应拦截器',res);
    
    // 处理token过期的特定状态码（例如401或特定的错误码）
    if (res.status === 401 || res.data.code === 401 || res.data.status === 401) {
        handleTokenExpire();
        return Promise.reject(new Error('token已过期'));
    }
    
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
    // 处理网络错误中的401情况
    if (err.response && err.response.status === 401) {
        handleTokenExpire();
    } else {
        ElMessage({
            message: err.message || '请求失败',
            type: 'error'
        });
    }
    hideLoading();
    return Promise.reject(err);
}
)

export default Axios;