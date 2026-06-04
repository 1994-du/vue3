<template>
<div class="customer_directive">
    <input type="text" v-focus v-show="isShow" v-move style="width: 100px;height: 20px;border: none;border-radius: 3px;text-indent: 10px;">
    <input type="color" @change="colorHandle">
    <div class="test"></div>
    <div :class="demo.democss" v-html="`<span class='${demo.demo_text}'>dddd</span>`"></div>
</div>
    
</template>

<script setup lang="ts">
import { ref, useCssModule, Directive } from 'vue'

const isShow = ref<boolean>(true)

// 定义自定义指令对象
const vMove: Directive = {
    created() {},
    beforeMount(el: HTMLElement) {
        el.style.background = 'var(--fontColor)';
        el.style.color = 'var(--inputColor)'
    },
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeUnmount() {},
    unmounted() {},
}

let color = ref<string>('#000')

const colorHandle = (event: Event): void => {
    const target = event.target as HTMLInputElement
    console.log(target.value);
    color.value = target.value
}

const demo = useCssModule('democss')
</script>
<style lang="less" scoped>
.customer_directive{
    width: 100%;
    display: flex;
    flex-direction: column;
    .test{
        width: 400px;
        height: 100px;
        background-color: v-bind(color);
    }
}
</style>
<style module="democss">
.democss{
    width: 100%;
    height: 100px;
    background-color: red;
}
.demo_text{
    color: blue;
}
</style>