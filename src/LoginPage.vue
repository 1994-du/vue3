<template>
    <main class="login-page">
        <section class="login-panel" aria-labelledby="login-title">
            <div class="login-logo">
                <span class="login-logo__mark">KE</span>
                <span class="login-logo__caret" aria-hidden="true"></span>
            </div>
            <p class="login-logo__sub">KNOWLEDGE ENGINE</p>

            <div class="login-head">
                <span class="data-label">TERMINAL ACCESS</span>
                <h1 id="login-title">{{ $t('login.title') }}</h1>
                <p>{{ $t('login.subtitle') }}</p>
            </div>

            <el-form :model="loginObj" label-position="top" class="login-form">
                <el-form-item :label="$t('login.account')">
                    <el-input v-focus v-model="loginObj.username" type="text" autocomplete="username"
                        placeholder="enter username" :prefix-icon="User" @keyup.enter="handleLogin" />
                </el-form-item>

                <el-form-item :label="$t('login.password')">
                    <el-input v-model="loginObj.password" type="password" autocomplete="current-password"
                        placeholder="enter password" :prefix-icon="Lock" show-password
                        @keyup.enter="handleLogin" />
                </el-form-item>

                <div class="form-options">
                    <el-checkbox v-model="loginObj.remember">{{ $t('login.rememberPassword') }}</el-checkbox>
                </div>

                <el-button type="primary" class="login-submit" :loading="isLoading" @click="handleLogin">
                    {{ $t('common.login') }}
                </el-button>

                <div class="form-footer">
                    <span>{{ $t('login.noAccount') }}</span>
                    <el-button link type="primary" @click="handleRegistry">{{ $t('login.registerNow') }}</el-button>
                </div>
            </el-form>

            <div class="login-foot">
                <span>KE · SECURE WORKSPACE ACCESS</span>
                <span>2026</span>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
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
const { t } = useI18n()
const isLoading = ref(false)
const loginObj = reactive<LoginForm>({
    username: '',
    password: '',
    remember: false
})

onMounted(() => {
    const saved = localStorage.getItem('loginCredentials')
    if (!saved) return

    try {
        const credentials = JSON.parse(saved)
        loginObj.username = credentials.username || ''
        loginObj.remember = Boolean(credentials.remember)
    } catch {
        localStorage.removeItem('loginCredentials')
    }
})

const validateCredentials = (): boolean => {
    if (!loginObj.username.trim() || !loginObj.password) {
        ElMessage.warning(t('login.accountRequired'))
        return false
    }
    return true
}

const saveCredentials = (): void => {
    if (loginObj.remember) {
        localStorage.setItem('loginCredentials', JSON.stringify({
            username: loginObj.username,
            remember: true
        }))
    } else {
        localStorage.removeItem('loginCredentials')
    }
}

const handleLogin = async (): Promise<void> => {
    if (!validateCredentials() || isLoading.value) return

    isLoading.value = true
    try {
        const res = await toLogin(loginObj)
        if (res.code !== 200) {
            ElMessage.error(res.message || res.msg || t('login.loginFailed'))
            return
        }

        const { token, menus = [], username, avatar } = res.data
        if (!token) {
            ElMessage.error(t('login.tokenMissing'))
            return
        }
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

    const res = await toRegistry({
        username: loginObj.username,
        password: loginObj.password
    })
    if (res.code === 200) {
        ElMessage.success(res.msg || t('login.registerSuccess'))
    }
}
</script>

<style lang="scss" scoped>
@use '@/styles/Login.scss';
</style>
