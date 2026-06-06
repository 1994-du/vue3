<template>
    <div class="login-container">
        <div class="login_inner">
            <el-form :model="loginObj" ref="loginForm">
                    <el-form-item label="用户名">
                        <el-input 
                            type="text"
                            v-focus 
                            placeholder="请输入账号" 
                            v-model="loginObj.username"
                        />
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input
                            type="password"
                            placeholder="请输入密码"
                            v-model="loginObj.password"
                            @keyup.enter="handleLogin"
                        />
                    </el-form-item>
                </el-form>
                <el-button @click="handleLogin">登录</el-button>
                <el-button @click="handleRegistry">注册</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { ref,reactive, onMounted } from 'vue'
import { toLogin, toRegistry } from '@/api/auth';

const store = useStore()
const router = useRouter()
interface LoginForm {
    username: string
    password: string
}

let loginObj = reactive<LoginForm>({
    username: "",
    password: ""
})

const handleLogin = function (): void {

    toLogin(loginObj).then(async (res: any) => {
        console.log('登录',res);
        const { token, menus, username, avatar } = res.data
        if (res.code === 200) {
            console.log('登录成功')
        }
    })
}

const handleRegistry = function (): void {
    toRegistry(loginObj).then((res: any) => {
        console.log('注册', res)
    })
}

onMounted(() => {
})
</script>
<style lang="scss" scoped>
@use '@/styles/Login.scss';
</style>