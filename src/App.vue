<template>
    <router-view></router-view>
</template>
<script setup>
import heighCode from "@/utils/highCode"
import { nextTick, onMounted } from "vue"
import { ElMessage } from 'element-plus'
onMounted(()=>{
    setTimeout(()=>{
        heighCode()
    },200)
})
</script>
<style lang="scss">
@import '@/styles/App.scss';
</style>