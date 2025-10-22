import { ElMessageBox } from 'element-plus';
import router from '../router';

let tokenCheckTimer = null; // 定时器引用

// 检查token是否过期
export const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    const expireTime = localStorage.getItem('tokenExpireTime');
    
    if (!token || !expireTime) return false; // 没有token时不需要提示过期
    
    return Date.now() > parseInt(expireTime);
}

// 清除token
export const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpireTime');
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
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
    console.log('设置token过期监听');
    // 清除之前可能存在的定时器
    if (tokenCheckTimer) {
        clearInterval(tokenCheckTimer);
    }
    
    // 每10秒检查一次token是否过期
    tokenCheckTimer = setInterval(() => {
        console.log('检查token过期');
        
        if (isTokenExpired()) {
            console.log('token过期');
            handleTokenExpire();
            clearInterval(tokenCheckTimer);
        }
    }, 600000);
}

// 清除token检查定时器
export const clearTokenCheckTimer = () => {
    if (tokenCheckTimer) {
        clearInterval(tokenCheckTimer);
        tokenCheckTimer = null;
    }
}