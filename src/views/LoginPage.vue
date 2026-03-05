<!--  -->
<template>
    <div class="login_inner">
        <div class="login_logo">
            KNOWLEDGE ENGINE
        </div>
        <div class="login_box">
            <div class="input_box">
                <el-form :model="loginObj" ref="loginFormRef" :rules="rules">
                    <el-form-item label="账号" prop="username">
                        <el-input size="large" v-focus type="text" placeholder="请输入账号" v-model="loginObj.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input size="large" type="password" placeholder="请输入密码" v-model="loginObj.password" @keyup.enter="handleLogin"></el-input>
                    </el-form-item>
                </el-form>
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
import { toLogin, toRegistry } from '@/api/api'
import useUserInfoStore from '../store/pinia/userInfo';
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
// JWT解析函数
const parseJWT = (token) => {
    try {
        // JWT由三部分组成，用.分隔，中间部分是payload
        const payload = token.split('.')[1];
        // 解码base64
        const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return decodedPayload;
    } catch (error) {
        console.error('JWT解析失败:', error);
        return null;
    }
}

const handleLogin = function () {
    if (!(window as any).db) {
        console.error('数据库未打开');
        return
    }
    toLogin(loginObj).then((res: any) => {
        console.log('登录',res);
        const { token,menus,username,avatar } = res.data
        if (res.code === 200) {
            // 保存token
            if (token) {
                localStorage.setItem('token', token);
                userInfoStore.setMenus(menus)
                userInfoStore.setUserInfo({name:username,avatar:avatar})
                // 解析JWT获取过期时间
                const payload = parseJWT(token);
                if (payload && payload.exp) {
                    // JWT的exp是秒级时间戳，需要转换为毫秒
                    const expireTime = payload.exp * 1000;
                    localStorage.setItem('tokenExpireTime', expireTime.toString());
                    console.log('Token过期时间:', new Date(expireTime).toLocaleString());
                }
            }

            localStorage.setItem('username', loginObj.username)
            

            router.replace('/')
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