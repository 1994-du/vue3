<!--  -->
<template>
    <div class="login_inner">
        <div class="login_logo">
            KNOWLEDGE ENGINE
        </div>
        <div class="login_box">
            <div class="input_box">
                    <div class="form-item">
                        <label class="form-label">账号</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            v-focus 
                            placeholder="请输入账号" 
                            v-model="loginObj.username"
                        >
                    </div>
                    <div class="form-item">
                        <label class="form-label">密码</label>
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
                <el-button size="large" type="primary" @click="handleLogin">登录</el-button>
                <el-button size="large" type="default" @click="handleRegistry">注册</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { ref,reactive } from 'vue'
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
    loginFormRef.value.validate().then(() => {
        toRegistry(loginObj).then(res => {
            console.log('注册', res)
        })
    })
}



</script>
<style lang="scss" scoped>
@use '@/styles/Login.scss';
</style>
