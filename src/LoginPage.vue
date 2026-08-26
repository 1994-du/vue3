<template>
    <main ref="loginRootRef" class="login-page">
        <section class="login-brand" aria-labelledby="product-title">
            <div class="brand-grid" aria-hidden="true"></div>
            <div class="brand-content">
                <span class="brand-index">KE / WORKSPACE</span>
                <div class="brand-lockup">
                    <span class="brand-mark-large">KE</span>
                    <span class="brand-rule" aria-hidden="true"></span>
                </div>
                <h1 id="product-title">Knowledge Engine</h1>
                <p>把零散知识整理成清晰、可检索、可复用的工作空间。</p>
                <div class="brand-topics" aria-label="知识主题">
                    <span>Engineering</span>
                    <span>Frontend</span>
                    <span>Operations</span>
                </div>
            </div>
            <div class="brand-footer">
                <span>Internal Knowledge Workspace</span>
                <span>2026</span>
            </div>
        </section>

        <section class="login-form-wrapper" aria-labelledby="login-title">
            <div class="mobile-brand">
                <span>KE</span>
                Knowledge Engine
            </div>

            <div class="form-panel">
                <div class="form-header">
                    <span class="form-kicker">ACCOUNT ACCESS</span>
                    <h2 id="login-title">账户登录</h2>
                    <p>使用你的工作空间账号继续</p>
                </div>

                <el-form :model="loginObj" label-position="top" class="login-form">
                    <el-form-item label="账号">
                        <el-input
                            v-focus
                            v-model="loginObj.username"
                            type="text"
                            autocomplete="username"
                            placeholder="请输入账号"
                            :prefix-icon="User"
                            size="large"
                            @keyup.enter="handleLogin"
                        />
                    </el-form-item>

                    <el-form-item label="密码">
                        <el-input
                            v-model="loginObj.password"
                            type="password"
                            autocomplete="current-password"
                            placeholder="请输入密码"
                            :prefix-icon="Lock"
                            size="large"
                            show-password
                            @keyup.enter="handleLogin"
                        />
                    </el-form-item>

                    <div class="form-options">
                        <el-checkbox v-model="loginObj.remember">记住密码</el-checkbox>
                    </div>

                    <el-button
                        type="primary"
                        size="large"
                        class="login-submit"
                        :loading="isLoading"
                        @click="handleLogin">
                        登录
                    </el-button>

                    <div class="form-footer">
                        <span>还没有账号？</span>
                        <el-button link type="primary" @click="handleRegistry">立即注册</el-button>
                    </div>
                </el-form>
            </div>

            <p class="login-legal">Knowledge Engine · Secure workspace access</p>
        </section>
    </main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { gsap } from 'gsap'
import { toLogin, toRegistry } from '@/api/auth'
import useUserInfoStore from '@/store/pinia/userInfo'
import { parseJWT, setupTokenExpiryCheck } from '@/utils/tokenManager'
import { initRoutes } from '@/utils/generateRoutes'

interface LoginForm {
    username: string
    password: string
    remember: boolean
}

const userInfoStore = useUserInfoStore()
const router = useRouter()
const loginRootRef = ref(null)
const isLoading = ref(false)
const loginObj = reactive<LoginForm>({
    username: '',
    password: '',
    remember: false
})

let loginAnimationMedia = null

const initLoginAnimations = () => {
    if (!loginRootRef.value) return

    loginAnimationMedia = gsap.matchMedia()
    loginAnimationMedia.add(
        {
            isDesktop: '(min-width: 761px)',
            reduceMotion: '(prefers-reduced-motion: reduce)'
        },
        context => {
            const { isDesktop, reduceMotion } = context.conditions
            const timeline = gsap.timeline({
                defaults: { ease: 'power3.out' }
            })

            timeline
                .from('.login-form-wrapper', {
                    autoAlpha: 0,
                    x: isDesktop ? 24 : 0,
                    y: isDesktop ? 0 : 16,
                    duration: reduceMotion ? 0 : 0.62
                }, 0)
                .from('.form-header > *', {
                    autoAlpha: 0,
                    y: reduceMotion ? 0 : 12,
                    duration: reduceMotion ? 0 : 0.38,
                    stagger: reduceMotion ? 0 : 0.08
                }, reduceMotion ? 0 : 0.18)
                .from('.login-form .el-form-item, .form-options, .form-footer', {
                    autoAlpha: 0,
                    y: reduceMotion ? 0 : 14,
                    duration: reduceMotion ? 0 : 0.34,
                    stagger: reduceMotion ? 0 : 0.06
                }, reduceMotion ? 0 : 0.3)
                .from('.login-legal', {
                    autoAlpha: 0,
                    duration: reduceMotion ? 0 : 0.3
                }, reduceMotion ? 0 : 0.58)

            if (isDesktop) {
                timeline
                    .from('.login-brand', {
                        autoAlpha: 0,
                        x: reduceMotion ? 0 : -20,
                        duration: reduceMotion ? 0 : 0.7
                    }, 0)
                    .from('.brand-content > *', {
                        autoAlpha: 0,
                        y: reduceMotion ? 0 : 14,
                        duration: reduceMotion ? 0 : 0.42,
                        stagger: reduceMotion ? 0 : 0.08
                    }, reduceMotion ? 0 : 0.2)
                    .from('.brand-footer > *', {
                        autoAlpha: 0,
                        duration: reduceMotion ? 0 : 0.3,
                        stagger: reduceMotion ? 0 : 0.05
                    }, reduceMotion ? 0 : 0.62)
            }

            if (!reduceMotion) {
                gsap.to('.brand-grid', {
                    x: 18,
                    y: 10,
                    duration: 18,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                })
                gsap.fromTo('.brand-mark-large', {
                    boxShadow: '0 0 0 0 rgba(143, 209, 195, 0.24)'
                }, {
                    boxShadow: '0 0 0 16px rgba(143, 209, 195, 0)',
                    duration: 2.8,
                    repeat: -1,
                    ease: 'power1.out'
                })
            }
        },
        loginRootRef.value
    )
}

onMounted(() => {
    nextTick(initLoginAnimations)

    const saved = localStorage.getItem('loginCredentials')
    if (!saved) return

    try {
        const credentials: LoginForm = JSON.parse(saved)
        loginObj.username = credentials.username || ''
        loginObj.password = credentials.password || ''
        loginObj.remember = Boolean(credentials.remember)
    } catch {
        localStorage.removeItem('loginCredentials')
    }
})

onUnmounted(() => {
    loginAnimationMedia?.revert()
})

const validateCredentials = (): boolean => {
    if (!loginObj.username.trim() || !loginObj.password) {
        ElMessage.warning('请输入账号和密码')
        return false
    }
    return true
}

const saveCredentials = (): void => {
    if (loginObj.remember) {
        localStorage.setItem('loginCredentials', JSON.stringify(loginObj))
    } else {
        localStorage.removeItem('loginCredentials')
    }
}

const handleLogin = async (): Promise<void> => {
    if (!validateCredentials() || isLoading.value) return

    isLoading.value = true
    try {
        const res: any = await toLogin(loginObj)
        if (res.code !== 200) {
            ElMessage.error(res.message || res.msg || '登录失败，请检查账号密码')
            return
        }

        const { token, menus = [], username, avatar } = res.data || {}
        saveCredentials()
        userInfoStore.setMenus(menus)
        userInfoStore.setUserInfo({ name: username, avatar })
        parseJWT(token)
        setupTokenExpiryCheck()
        const defaultPath = await initRoutes(menus)
        await router.replace(defaultPath)
    } finally {
        isLoading.value = false
    }
}

const handleRegistry = async (): Promise<void> => {
    if (!validateCredentials()) return

    const res: any = await toRegistry({
        username: loginObj.username,
        password: loginObj.password
    })
    if (res.code === 200) {
        ElMessage.success(res.msg || '注册成功，请登录')
    }
}
</script>

<style lang="scss" scoped>
@use '@/styles/Login.scss';
</style>
