<!--  -->
<template>
    <h4>防抖</h4>
    <el-input clearable type="text" v-model="debounceVal" @input="debounceHandle(1000)"></el-input>
    <p>{{debounceValShow}}</p>
    <highlightjs code="const debounceHandle=function(fn,delay){
    if(debounceTimer){
        clearTimeout(debounceTimer)
    }
    debounceTimer=setTimeout(()=>{
        fn()
    },delay)
}"></highlightjs>
    <h4>节流</h4>
    <el-input v-focus clearable type="text" v-model="throttleVal" @input="throttleHandle(1000)"></el-input>
    <p>{{throttleValShow}}</p>
    <highlightjs code="const throttleHandle=function(fn,delay){
    if(!throttleTimer){
        throttleTimer=setTimeout(()=>{
            fn()
            throttleTimer=null
        },delay)
    }
}"></highlightjs>
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
}
</style>