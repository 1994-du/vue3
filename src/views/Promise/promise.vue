<template>
    <el-button @click="toLogin">登录失效请求测试</el-button>
</template>
<script setup>
import { toDelayTest } from "../../api/api"
const toLogin = ()=>{
    toDelayTest()
}
</script>