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
import { parseJWT } from '../utils/tokenManager'
import useUserInfoStore from '../store/pinia/userInfo';
import { initRoutes } from '../utils/generateRoutes';

const userInfoStore = useUserInfoStore()
let loginObj = reactive({
    username: "",
    password: ""
})
const store = useStore()
const router = useRouter()
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
            // 保存token
            if (token) {
                // localStorage.setItem('token', token);
                userInfoStore.setMenus(menus)
                userInfoStore.setUserInfo({name:username,avatar:avatar})
                // 解析JWT获取过期时间
                parseJWT(token);
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
