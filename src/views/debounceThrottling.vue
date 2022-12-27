<!--  -->
<template>
    <h2>防抖</h2>
    <p><img src="static/image/debounceFn.png" alt=""></p>
    <input type="text" v-model="debounceVal" @input="debounceHandle(1000)">
    <p>{{debounceValShow}}</p>
    <h2>节流</h2>
    <p><img src="static/image/throttleFn.png" alt=""></p>
    <input type="text" v-model="throttleVal" @input="throttleHandle(1000)">
    <p>{{throttleValShow}}</p>
</template>

<script setup>
import {ref} from "vue"
const debounceVal =ref('')
const throttleVal = ref('')
let debounceValShow=ref('')
let throttleValShow=ref('')
let debounceTimer;
let throttleTimer;
const debounceFn=function(val){
    debounceValShow.value=val
    console.log('debounceValShow',debounceValShow.value)
}
const throttleFn=function(val){
    throttleValShow.value=val
    console.log('throttleValShow',throttleValShow.value)
}
const debounceHandle=function(delay){
    if(debounceTimer){
        clearTimeout(debounceTimer)
    }
    debounceTimer=setTimeout(()=>{
        debounceFn(debounceVal.value)
    },delay)
}
const throttleHandle=function(delay){
    if(!throttleTimer){
        throttleTimer=setTimeout(()=>{
            throttleFn(throttleVal.value)
            throttleTimer=null
        },delay)
    }
}
</script>
<style lang="less" scoped>
h2,p{
    text-align: left;
}
input{
    display: block;
}
img {
    width: 100px;
    transition: all 2s;
    &:hover {
        width: 400px;
        transform: scale(1.5) translateX(60px) translateY(40px);
    }
}
</style>