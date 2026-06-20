<template>
    <div class="login-page">
        <!-- 左侧品牌区 -->
        <div class="login-brand">
            <div class="brand-bg">
                <div class="floating-shape shape-1"></div>
                <div class="floating-shape shape-2"></div>
                <div class="floating-shape shape-3"></div>
            </div>
            <div class="brand-content">
                <div class="brand-logo">
                    <svg viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="54" stroke="url(#bg)" stroke-width="3" />
                        <path d="M36 60L52 76L84 44" stroke="url(#bg)" stroke-width="4.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <circle cx="60" cy="60" r="4" fill="url(#bg)" />
                        <circle cx="60" cy="60" r="12" stroke="url(#bg)" stroke-width="1.5" stroke-dasharray="5 4">
                            <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60"
                                dur="12s" repeatCount="indefinite" />
                        </circle>
                        <defs>
                            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#00d4ff" />
                                <stop offset="50%" stop-color="#6366f1" />
                                <stop offset="100%" stop-color="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1 class="brand-title">KNOWLEDGE ENGINE</h1>
                <p class="brand-subtitle">构建你的知识体系，让学习更高效</p>
                <div class="brand-stats">
                    <div class="stat-item">
                        <span class="stat-num">128+</span>
                        <span class="stat-label">知识模块</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <span class="stat-num">50K+</span>
                        <span class="stat-label">活跃用户</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <span class="stat-num">99%</span>
                        <span class="stat-label">好评率</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧登录区 -->
        <div class="login-form-wrapper">
            <div class="form-card">
                <div class="form-header">
                    <h2>欢迎回来</h2>
                    <p>请登录您的账号以继续</p>
                </div>

                <el-form :model="loginObj" ref="loginFormRef" class="login-form">
                    <div class="field-group">
                        <label class="field-label">
                            <el-icon>
                                <User />
                            </el-icon>
                            账号
                        </label>
                        <el-input type="text" v-focus placeholder="请输入账号" v-model="loginObj.username"
                            :prefix-icon="User" size="large" />
                    </div>

                    <div class="field-group">
                        <label class="field-label">
                            <el-icon>
                                <Lock />
                            </el-icon>
                            密码
                        </label>
                        <el-input type="password" placeholder="请输入密码" v-model="loginObj.password" :prefix-icon="Lock"
                            size="large" show-password @keyup.enter="handleLogin" />
                    </div>

                    <div class="form-options">
                        <el-checkbox v-model="loginObj.remember">记住密码</el-checkbox>
                    </div>

                    <button type="button" class="btn-login" @click="handleLogin" :class="{ loading: isLoading }">
                        <span v-if="!isLoading">登 录</span>
                        <span v-else class="btn-spinner"></span>
                        <div class="btn-glow"></div>
                    </button>

                    <div class="form-footer">
                        <span class="footer-text">还没有账号？</span>
                        <a href="javascript:;" class="link-register" @click="handleRegistry">立即注册</a>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { toLogin, toRegistry } from '@/api/auth'
import useUserInfoStore from '../store/pinia/userInfo'
import { parseJWT, setupTokenExpiryCheck } from '../utils/tokenManager'
import { initRoutes, preloadDynamicRoutes } from '../utils/generateRoutes'

const userInfoStore = useUserInfoStore()
const router = useRouter()

interface LoginForm {
    username: string
    password: string
    remember: boolean
}

const loginFormRef = ref<any>(null)
const isLoading = ref(false)

let loginObj = reactive<LoginForm>({
    username: '',
    password: '',
    remember: false
})

// 恢复记住的凭据
onMounted(() => {
    const saved = localStorage.getItem('loginCredentials')
    if (saved) {
        try {
            const creds: LoginForm = JSON.parse(saved)
            loginObj.username = creds.username || ''
            loginObj.password = creds.password || ''
            loginObj.remember = creds.remember || false
        } catch { }
    }
})

function saveCredentials(): void {
    if (loginObj.remember) {
        localStorage.setItem('loginCredentials', JSON.stringify(loginObj))
    } else {
        localStorage.removeItem('loginCredentials')
    }
}

async function handleLogin(): Promise<void> {
    isLoading.value = true
    try {
        const res: any = await toLogin(loginObj)
        console.log('登录', res)
        const { token, menus, username, avatar } = res.data

        if (res.code === 200) {
            saveCredentials()
            userInfoStore.setMenus(menus)
            userInfoStore.setUserInfo({ name: username, avatar })
            parseJWT(token)
            setupTokenExpiryCheck()
            const defaultPath = await initRoutes(menus)
            void preloadDynamicRoutes(menus)
            await router.replace(defaultPath)
        }
    } finally {
        isLoading.value = false
    }
}

function handleRegistry(): void {
    toLogin(loginObj).then((res: any) => console.log('注册', res))
}
</script>

<style lang="scss" scoped>
@use '@/styles/Login.scss';
</style>
