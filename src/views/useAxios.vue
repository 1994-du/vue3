<template>
    <div class="use_axios">
        <h2>一、依赖引入</h2>
        <img src="/static/image/useAxios-install.png" alt="">
        <h2>二、创建axios文件</h2>
        <img src="/static/image/useAxios-create.png" alt="">
        <h2>三、绑定到全局</h2>
        <img src="/static/image/useAxios-main.png" alt="">
        <h2>四、使用$axios</h2>
        <img src="/static/image/useAxios-use.png" alt="">
        <h2>
            请求方法：get、post、delete、put、patch、options、head
        </h2>
        <h2>Axios取消请求</h2>
        <el-button @click="toRequest">请求</el-button>
    </div>
</template>
<script setup>
import {api} from "@/api/api.js"
import { getCurrentInstance } from "vue";
const {proxy} = getCurrentInstance();
const getReq = function(){
    proxy.$axios.get(api.getLoL).then(res=>{
        console.log(res.data)
    })
}

const controller = new AbortController();
const toRequest = function(){
    proxy.$axios.post('/api/test',{signal: controller.signal}).then(res=>{
        console.log('test',res);
    })
    controller.abort()
}
</script>
<style lang="less" scoped>
h2,p{
    text-align: left;
}
.use_axios{
    display: flex;
    flex-direction: column;
}
img {
    width: 100px;
    transition: all 2s;
}  
</style>