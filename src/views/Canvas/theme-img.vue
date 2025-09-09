<template>
    <div class="theme-img-list">
        <theme-img v-for="value in source" :key="value.id" :src="value.src"></theme-img>
    </div>
</template>

<script setup>
import themeImg from './components/theme-img.vue';
let source = [
    {id:1,src: new URL('@/assets/1.jpg', import.meta.url).href},
    {id:2,src: new URL('@/assets/22.png', import.meta.url).href},
    {id:3,src: new URL('@/assets/kenan.png', import.meta.url).href},
    {id:4,src: new URL('@/assets/vue.svg', import.meta.url).href},
]
</script>
<style scoped lang='less'>
.theme-img-list{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    justify-items: center;
    align-items: center;
    gap: 10px;
}
</style>