<template>
    <router-view></router-view>
</template>
<script setup>
import { onMounted } from 'vue';
import startIndexedDB from '@/utils/startIndexedDB';
onMounted(async() => {
    try{
        window.$db = await startIndexedDB.openDatabase()
    }
    catch(e){
        console.error('打开数据库失败',e)
    }
})
</script>
<style lang="scss">
@import '@/styles/App.scss';
</style>