<template>
login
<div class="login_wrap">
    <div class="login_inner">
        <input type="text" placeholder="账号" v-model="username">
        <input type="password" placeholder="密码" v-model="password">
        <button @click="Login">登录</button>
    </div>
</div>
</template>
<script setup>
import { getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance()
let username=ref('')
let password=ref('')
let router = useRouter()
const Login=()=>{
    let param={
        username:username.value,
        password:password.value
    }
    proxy.$axios.post('/api/login',{...param}).then(res=>{
        if(res.status==='success'){
            localStorage.setItem('token',Math.random()*100)
            router.push('/')
        }
    })
}
</script>