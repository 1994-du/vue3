<template>
<div class="customer_directive">
    <input type="text" v-focus v-show="isShow" v-move style="width: 100px;height: 20px;border: none;border-radius: 3px;text-indent: 10px;">
    <input type="color" @change="colorHandle">
    <div class="test"></div>
    <div :class="demo.democss" v-html="`<span class='${demo.demo_text}'>dddd</span>`"></div>
</div>
    
</template>

<script setup>
import {ref, useCssModule} from 'vue'
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

let color=ref('#000')
const colorHandle=(event)=>{
    console.log(event.target.value);
    
    color.value=event.target.value
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