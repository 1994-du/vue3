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
import { reactive, onMounted} from 'vue'
import IndexDB from '@/utils/indexedDB';
import { toLogin,toRegistry } from '@/api/api'
let loginObj=reactive({
    username:"",
    password:""
})
const store = useStore()
const router = useRouter()

const handleLogin= function(){
    if(!(window as any).db){
        console.error('数据库未打开');
        return
    }
    toLogin(loginObj).then(res=>{
        console.log('登录',res);
        
        if(res.status==200){
            IndexDB.addMenu(loginObj.username,res).then(res=>{
                console.log('添加菜单成功',res)
                router.replace('/')
            }).catch(err=>{
                console.error('添加菜单失败',err)
            })
            localStorage.setItem('username',loginObj.username)
        }
    })
}
const handleRegistry = function(){
    toRegistry(loginObj).then(res=>{
        console.log('注册',res)
    })
}

</script>
<style lang="less" scoped>
@import '@/styles/Login.scss';
</style>