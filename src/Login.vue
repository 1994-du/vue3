<template>
<div class="login_wrap">
    <div class="login_inner">
        <div class="login_box" :class="loginType==0?'active':'disactive'">
            <div class="login_c" v-if="loginType==0">
                <span class="current_status">登录</span>
                <div class="ipts">
                    <el-input type="text" placeholder="账号" v-model="account"></el-input>
                    <el-input type="password" placeholder="密码" v-model="password" @keydown.enter="Login"></el-input>
                    <span class="forget_password">忘记密码？</span>
                </div>
                <el-button @click="Login">登录</el-button>
            </div>
            <div class="login_d" v-else>
                <el-button @click="loginType=0">登录</el-button>
            </div>
        </div>
        <div class="registry_box" :class="loginType==1?'active':'disactive'">
            <div class="registry_c" v-if="loginType!=0">
                <span class="current_status">注册</span>
                <div class="ipts">
                    <el-input type="text" placeholder="用户名" v-model="username"></el-input>
                    <el-input type="text" placeholder="账号" v-model="account"></el-input>
                    <el-input type="password" placeholder="密码" v-model="password" @keydown.enter="Registry"></el-input>
                </div>
                <el-button @click="Registry">注册</el-button>
            </div>
            <div class="registry_d" v-else>
                <el-button @click="loginType=1">注册</el-button>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
import { getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance()
let loginType=ref(0);// 当前状态
let account = ref('');//账号
let username=ref('');//姓名
let password=ref('');//密码
let router = useRouter()
// 登录
const Login=()=>{
    // sessionStorage.setItem('token',Math.random()*100)
    // router.push('/')
    let param={
        // username:username.value,
        account:account.value,
        password:password.value
    }
    proxy.$axios.post('/api/login',{...param}).then(res=>{
        if(res.status==='success'){
            sessionStorage.setItem('token',JSON.stringify(res.data))
            router.push('/')
        }
    })
}
// 注册
const Registry = ()=>{
    let param={
        username:username.value,
        account:account.value,
        password:password.value
    }
    proxy.$axios.post('/api/registry',{...param}).then(res=>{
        console.log('注册',res);
    })
}
</script>
<style lang="less" scoped>
@import '@/styles/login.less';
</style>