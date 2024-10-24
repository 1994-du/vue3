<template>
    <h1>组件引入</h1>
    <!-- components:{
        menuSearchResult
    } -->

    <button @click="toReq">请求</button>
    <button @click="toReqParam">get请求带参数</button>
    <button @click="toPostReq">post请求</button>
</template>
<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const toReq = ()=>{
    proxy.$axios.get('/javaapi/firstReq').then(res=>{
        console.log('res',res);
    })
}
const toReqParam = ()=>{
    proxy.$axios.get('/javaapi/getParam?name=123').then(res=>{
        console.log('resparas',res);
    })
}
const toPostReq = ()=>{
    proxy.$axios.post('/javaapi/login',{account:'123',password:'123'}).then(res=>{
        console.log('postRes',res);
    })
}
</script>
<style lang="less" scoped>
*{
    text-align: left;
}
</style>