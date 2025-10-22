<!--  -->
<template>
    <div class="login_inner">
        <div class="login_img"></div>
        <div class="login_box">
            <div class="input_box">
                <div class="usename">
                    <el-input v-focus type="text" placeholder="请输入账号" v-model="loginObj.username"></el-input>
                </div>
                <div class="password">
                    <el-input type="password" placeholder="请输入密码" v-model="loginObj.password"></el-input>
                </div>
            </div>
            
            <div class="login_buttons">
                <button class="login" @click="handleLogin">登录</button>
                <button  class="register" @click="handleRegistry">注册</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { reactive } from 'vue'
import IndexDB from '@/utils/indexedDB';
import { toLogin,toRegistry } from '@/api/api'
import { ElMessageBox } from 'element-plus';
import { setupTokenExpiryCheck } from '@/utils/tokenManager';
let loginObj=reactive({
    username:"",
    password:""
})
const store = useStore()
const router = useRouter()

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

const handleLogin= function(){
    if(!(window as any).db){
        console.error('数据库未打开');
        return
    }
    toLogin(loginObj).then(res=>{
        console.log('登录',res);
        
        if(res.status==200){
            // 保存token
            if(res.token){
                localStorage.setItem('token', res.token);
                
                // 解析JWT获取过期时间
                const payload = parseJWT(res.token);
                if(payload && payload.exp){
                    // JWT的exp是秒级时间戳，需要转换为毫秒
                    const expireTime = payload.exp * 1000;
                    localStorage.setItem('tokenExpireTime', expireTime.toString());
                    console.log('Token过期时间:', new Date(expireTime).toLocaleString());
                }
            }
            
            localStorage.setItem('username',loginObj.username)
            localStorage.setItem('userid',res.userId)
            
            // 登录成功后启动token过期监听
            setupTokenExpiryCheck();
            
            router.replace('/')
        }
    })
}
const handleRegistry = function(){
    toRegistry(loginObj).then(res=>{
        console.log('注册',res)
    })
}



</script>
<style lang="scss" scoped>
@use '@/styles/Login.scss';
</style>