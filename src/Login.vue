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
import { toLogin ,toRegistry} from "@/api/api";
import { useStore } from 'vuex'
const store = useStore()
// 获取当前实例
const { proxy } = getCurrentInstance()
let loginType=ref(0);// 当前状态
let account = ref('');//账号
let username=ref('');//姓名
let password=ref('');//密码
let router = useRouter()
// 登录
const Login=()=>{
    let param={
        account:account.value,
        password:password.value
    }
    toLogin(param).then(res=>{
        if(res.status==='success'){
            let userInfo={
                name:res.data.name,
                id:res.data.id,
                avatar:res.data.avatar
            }
            // 菜单数据
            store.commit('SYNC_SET_MENUDATA',res.data.navList)
            // 用户信息
            store.dispatch('ASYNC_SET_USERINFO',userInfo)
            // 保存状态
            store.commit('SAVE_STATE')
            // 跳转
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
    toRegistry(param)
}
</script>
<style lang="less" scoped>
</style>