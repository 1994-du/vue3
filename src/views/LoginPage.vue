<!--  -->
<template>
    <div class="login_inner">
        <div class="login_img"></div>
        <div class="login_box">
            <div class="input_box">
                <div class="usename">
                    <input v-focus type="text" placeholder="请输入账号" v-model="loginObj.username">
                </div>
                <div class="password">
                    <input :type="isShowPassword?'password':'text'" placeholder="请输入密码" v-model="loginObj.password">
                    <img v-show="isShowPassword" class="showpassword" src="https://s4.ax1x.com/2022/01/07/79E7dg.png" alt="" @click="isShowPassword=!isShowPassword">
                    <img v-show="!isShowPassword" class="showpassword" src="https://s4.ax1x.com/2022/01/07/79EOWn.png" alt="" @click="isShowPassword=!isShowPassword">
                </div>
            </div>
            
            <div class="login_buttons">
                <button class="login" @click="toLogin">登录</button>
                <button  class="register" @click="toRegister">注册</button>
                <button type="text" class="forget">忘记密码？</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import indexedDB from '../utils/indexedDB';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import {ref,getCurrentInstance, reactive, onMounted} from 'vue'
import { ElDialog, ElMessage } from 'element-plus';
let loginObj=reactive({
    username:"",
    password:""
})
let {proxy}=getCurrentInstance()
const store = useStore()
const router = useRouter()

// 事务
let db = null;
const toLogin=async function(){
    if(!db){
        console.error('数据库未打开');
        return
    }
    // proxy.$axios.post('/api/login',JSON.stringify(loginObj)).then(res=>{
    //     console.log('请求登录',res)
    //     if(res.status==200){
    //         router.replace('/')
    //         store.commit('changLogin',{val:1})
    //         sessionStorage.setItem('islogin',1)
    //     }
    // })
    // // router.replace('/')
    // // store.commit('changLogin',{val:1})
    // // sessionStorage.setItem('islogin',1)
    try{
        let queryRes = await indexedDB.queryCustomers(db,loginObj.username)
        console.log('查询结果',queryRes);
        if(!queryRes){
            ElMessage({
                message:'查询不到当前用户，是否注册？',
                type:'warning',
            })
        }else{
            ElMessage({
                message:'登录成功',
                type:'success',
            })
            router.replace('/')
        }
        
    }
    catch(err){
        console.log('查询用户失败',err);
    }
    
}
const toRegister = async function(){
    const newUser={
        username:loginObj.username,
        password:loginObj.password
    }
    try{
        await indexedDB.addCustomer(db,newUser)
    }
    catch(err){
        ElMessage({
            message:`添加用户失败:${err}`,
            type:'error',
        })
    }
    
}

const isShowPassword=ref(true)

onMounted(async()=>{
    try{
        db =  await indexedDB.openDatabase() 
    }
    catch(err){
        console.log('打开数据库失败',err);
    }
})
</script>
<style lang="less" scoped>
.login_inner{
    color: white;
    width: 600px;
    height: 250px;
    background: rgb(255, 255, 255);
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 20px;
    display: flex;
    .login_img{
        flex: 1;
        height: 100%;
        background-size: cover;
    }
    .login_box{
        width: 50%;
        padding:0 0 0 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .input_box{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .usename,.password{
                width: 100%;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                position: relative;
                input{
                    height: 30px;
                    width: 100%;
                    text-indent: 16px;
                    outline: none;
                    border: none;
                    border-bottom: 1px solid #aaa;
                    background: white;
                }
                .showpassword{
                    display: none;
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    width: 20px;
                    height: 20px;
                }
            }
            .password:hover img{
                display: block;
            }
        }
        
        .login_buttons{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            button{
                width: 100%;
                height: 34px;
                outline: none;
                padding: 5px  10px;
                border-radius: 5px;
                cursor: pointer;
                border: none;
                margin-top: 15px;
            }
            .login{
                background-color: rgb(235, 229, 153);
                color: rgb(99, 94, 94);
                border-radius: 50px;
            }
            .register{
                background-color: rgb(88, 77, 240);
                color: rgb(255, 255, 255);
                border-radius: 50px;
            }
            .forget{
                background-color: white;
                color: green;
            }
        }
    }
}
</style>