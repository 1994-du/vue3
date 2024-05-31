<template>
    <router-view v-slot="{Component}">
        <keep-alive>
            <component :is="Component"></component>
        </keep-alive>
    </router-view>
</template>
<script setup>
import { onBeforeRouteUpdate } from 'vue-router';
</script>
<style lang="less">
#subapp-viewport{
    height: 100%;
}
html,body{
    width:100%;
    height:100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
}
</style>