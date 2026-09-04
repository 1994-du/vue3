<template>
    <h1>组件引入</h1>
    <!-- components:{
        menuSearchResult
    } -->

    <button @click="toReq">请求</button>
    <button @click="toReqParam">get请求带参数</button>
    <button @click="toPostReq">post请求</button>
</template>
<script setup lang="ts">
import axios from 'axios';

const toReq = (): void => {
    axios.get('/javaapi/firstReq').then(res => {
    })
}

const toReqParam = (): void => {
    axios.get('/javaapi/getParam?name=123').then(res => {
    })
}

const toPostReq = (): void => {
    axios.post('/javaapi/login', { account: '123', password: '123' }).then(res => {
    })
}
</script>
<style lang="scss" scoped>
*{
    text-align: left;
}
</style>