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
                    <el-input :type="isShowPassword?'password':'text'" placeholder="请输入密码" v-model="loginObj.password"></el-input>
                    <img v-show="isShowPassword" class="showpassword" src="https://s4.ax1x.com/2022/01/07/79E7dg.png" alt="" @click="isShowPassword=!isShowPassword">
                    <img v-show="!isShowPassword" class="showpassword" src="https://s4.ax1x.com/2022/01/07/79EOWn.png" alt="" @click="isShowPassword=!isShowPassword">
                </div>
            </div>
            
            <div class="login_buttons">
                <button class="login" @click="toLogin">登录</button>
                <button  class="register" @click="toRegister">注册</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import {ref,getCurrentInstance, reactive, onMounted} from 'vue'

const isShowPassword=ref(true)

let loginObj=reactive({
    username:"",
    password:""
})
const store = useStore()
const router = useRouter()

const toLogin= function(){
    if(!(window as any).db){
        console.error('数据库未打开');
        return
    }
    axios.post('/api/login',loginObj).then(res=>{
        console.log('请求登录',res)
        if(res.status==200){
            router.replace('/')
            store.commit('changLogin',{val:1})
            sessionStorage.setItem('islogin','1')
        }
    })
}
const toRegister = function(){
    
    axios.post('/api/toregistry',JSON.stringify(loginObj)).then(res=>{
        console.log('注册',res)
        
    })
}


</script>
<style lang="less" scoped>
@import '@/styles/Login.scss';
</style>