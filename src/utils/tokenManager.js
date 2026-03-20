import { ElMessageBox } from 'element-plus';
import router from '../router';
let tokenCheckTimer = null; // 定时器引用

// JWT解析函数
export const parseJWT = (token) => {
    try {
        // JWT由三部分组成，用.分隔，中间部分是payload
        const payload = token.split('.')[1];
        // 解码base64
        const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        if(decodedPayload&&decodedPayload.exp){
            // JWT的exp是秒级时间戳，需要转换为毫秒
            const expireTime = decodedPayload.exp * 1000;
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpireTime', expireTime.toString());
            console.log('Token过期时间:', new Date(expireTime).toLocaleString());
        }
    } catch (error) {
        console.error('JWT解析失败:', error);
        return null;
    }
}

// 检查token是否过期
export const isTokenExpired = () => {
    console.log('检查token是否过期');
    // const token = localStorage.getItem('token');
    const expireTime = localStorage.getItem('tokenExpireTime');
    
    if (!expireTime) return true; // 没有token时不需要提示过期
    
    return Date.now() > parseInt(expireTime);
}

// 清除token
export const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpireTime');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('theme');
}

// token过期处理
export const handleTokenExpire = () => {
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

// 设置token过期监听
export const setupTokenExpiryCheck = () => {
    // 如果当前不是登录路由，才设置token过期监听
    if (window.location.pathname === '/login') return;
    // 清除之前可能存在的定时器
    if (tokenCheckTimer) {
        clearInterval(tokenCheckTimer);
    }
    // 每10秒检查一次token是否过期
    tokenCheckTimer = setInterval(() => {
        if (isTokenExpired()) {
            handleTokenExpire();
            clearInterval(tokenCheckTimer);
        }
    }, 10000);
}

// 清除token检查定时器
export const clearTokenCheckTimer = () => {
    if (tokenCheckTimer) {
        clearInterval(tokenCheckTimer);
        tokenCheckTimer = null;
    }
}
// 登录退出效果
export const loginOutEffect = () => {
    clearToken()
    clearTokenCheckTimer()
    router.replace('/login')
}