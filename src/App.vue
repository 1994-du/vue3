<template>
    <RouterView></RouterView>
</template>
<script setup>
import { RouterView } from 'vue-router';
import { onMounted, onBeforeUnmount } from 'vue';
import { clearTokenCheckTimer } from './utils/tokenManager';

// 组件卸载前清除定时器，防止内存泄漏
onBeforeUnmount(() => {
    clearTokenCheckTimer();
});
</script>
<style lang="scss">
@use '@/styles/App.scss';
</style>