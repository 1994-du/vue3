<!--  -->
<template>
    <div class="login-container">
        <!-- 科技背景 -->
        <div class="tech-bg"></div>
        
        <!-- 科技装饰层 -->
        <div class="tech-overlay">
            <div class="grid-bg"></div>
            <div class="particle-bg" id="particle-bg"></div>
            <div class="line-bg">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
        
        <!-- 登录内容 -->
        <div class="login_inner">
            <div class="login_logo">
                <div class="logo-icon">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke="url(#logo-gradient)" stroke-width="3"/>
                        <path d="M30 50L45 65L70 35" stroke="url(#logo-gradient)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="50" cy="50" r="3" fill="url(#logo-gradient)"/>
                        <circle cx="50" cy="50" r="8" stroke="url(#logo-gradient)" stroke-width="1.5" stroke-dasharray="4 4">
                            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite"/>
                        </circle>
                        <defs>
                            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#00d4ff"/>
                                <stop offset="50%" stop-color="#8b5cf6"/>
                                <stop offset="100%" stop-color="#06b6d4"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div class="logo-text">KNOWLEDGE ENGINE</div>
            </div>
            
            <div class="login_box">
                <div class="input_box">
                        <div class="form-item">
                            <label class="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                账号
                            </label>
                            <input 
                                type="text" 
                                class="form-input" 
                                v-focus 
                                placeholder="请输入账号" 
                                v-model="loginObj.username"
                            >
                        </div>
                        <div class="form-item">
                            <label class="form-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                密码
                            </label>
                            <input 
                                type="password" 
                                class="form-input" 
                                placeholder="请输入密码" 
                                v-model="loginObj.password"
                                @keyup.enter="handleLogin"
                            >
                        </div>
                        <div class="form-item remember-item">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                v-model="loginObj.remember"
                            >
                            <label for="remember" class="remember-label">记住账号密码</label>
                        </div>
                    </div>

                <div class="login_buttons">
                    <button class="btn btn-primary" @click="handleLogin">
                        <span class="btn-text">登录</span>
                        <div class="btn-glow"></div>
                    </button>
                    <button class="btn btn-secondary" @click="handleRegistry">
                        <span class="btn-text">注册</span>
                    </button>
                </div>
            </div>
            
            <!-- 底部装饰 -->
            <div class="footer-decor">
                <div class="decor-line"></div>
                <div class="decor-line"></div>
                <div class="decor-line"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { ref,reactive, onMounted } from 'vue'
import { toLogin, toRegistry } from '@/api/auth'
import { parseJWT, setupTokenExpiryCheck } from '../utils/tokenManager'
import useUserInfoStore from '../store/pinia/userInfo';
import { initRoutes } from '../utils/generateRoutes';

const userInfoStore = useUserInfoStore()
let loginObj = reactive({
    username: "",
    password: "",
    remember: false
})
const store = useStore()
const router = useRouter()

// 页面加载时，从localStorage读取保存的账号密码
const loadSavedCredentials = () => {
    const savedCredentials = localStorage.getItem('loginCredentials')
    if (savedCredentials) {
        try {
            const credentials = JSON.parse(savedCredentials)
            loginObj.username = credentials.username || ''
            loginObj.password = credentials.password || ''
            loginObj.remember = credentials.remember || false
        } catch (error) {
            console.error('读取保存的账号密码失败:', error)
        }
    }
}

// 保存账号密码到localStorage
const saveCredentials = () => {
    if (loginObj.remember) {
        const credentials = {
            username: loginObj.username,
            password: loginObj.password,
            remember: loginObj.remember
        }
        localStorage.setItem('loginCredentials', JSON.stringify(credentials))
    } else {
        localStorage.removeItem('loginCredentials')
    }
}

// 页面加载时执行
loadSavedCredentials()
const rules = reactive({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})
const loginFormRef = ref(null)


const handleLogin = function () {
    if (!(window as any).db) {
        console.error('数据库未打开');
        return
    }
    toLogin(loginObj).then(async (res: any) => {
        console.log('登录',res);
        const { token,menus,username,avatar } = res.data
        if (res.code === 200) {
            // 保存账号密码
            saveCredentials()
            
            // 保存token
            if (token) {
                userInfoStore.setMenus(menus)
                userInfoStore.setUserInfo({name:username,avatar:avatar})
                parseJWT(token);
                setupTokenExpiryCheck()
            }
            const defaultRoutePath = await initRoutes(menus)
            // localStorage.setItem('username', loginObj.username)
            await router.replace(defaultRoutePath)
        }
    })
}
const handleRegistry = function () {
    loginFormRef.value?.validate?.()
    toRegistry(loginObj).then(res => {
        console.log('注册', res)
    })
}

// 创建粒子效果
const createParticles = () => {
    const container = document.getElementById('particle-bg')
    if (!container) return
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 10 + 's'
        particle.style.animationDuration = (5 + Math.random() * 10) + 's'
        container.appendChild(particle)
    }
}

onMounted(() => {
    createParticles()
})


</script>
<style lang="scss" scoped>
@use '@/styles/Login.scss';
</style>