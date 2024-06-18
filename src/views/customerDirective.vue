<!--  -->
<template>
<div class="customer_directive">
    <input type="text" v-focus v-show="isShow" v-move style="width: 100px;height: 20px;border: none;border-radius: 3px;text-indent: 10px;">
</div>
    
</template>

<script setup>
import {ref} from 'vue'
const isShow=ref(true)
const vMove={
    create(){},
    beforeMount() {},
    mounted(el) {
        el.style.background='var(--fontColor)';
        el.style.color='var(--inputColor)'
    },
    beforeUpdate() {},
    updated() {},
    beforeUnmount() {},
    unmounted() {},
}
</script>
<style lang="less" scoped>
.customer_directive{
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>