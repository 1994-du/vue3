<template>
    <router-view v-slot="{Component}">
        <keep-alive>
            <component :is="Component"></component>
        </keep-alive>
    </router-view>
</template>
<script setup>
import { onBeforeRouteUpdate } from 'vue-router';

// onBeforeRouteUpdate((to,from,next)=>{
//     console.log(to,from,next);
// })
</script>