<!--  -->
<template>
    <h4>防抖</h4>
<CodeEditor code="function debounceHandle(fn,delay){
    let debounceTimer;
    return function(...args){
        const context = this;
        if(debounceTimer){
            clearTimeout(debounceTimer)
        }
        debounceTimer=setTimeout(()=>{
            fn.apply(context, args)
        },delay)
    }
}
"/>
<CodeEditor class="my-[10px]" code="// 立即执行
function debounce(fn, delay, immediate = false) {
  let timer = null
  return function (...args) {
    const context = this
    if (immediate) {
      const callNow = !timer  // 第一次触发时为 true

      timer = setTimeout(() => {
        timer = null
      }, delay)

      if (callNow) {
        fn.apply(context, args)
      }
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }
}"/>
<el-input class="my-[10px]" clearable type="text" v-model="debounceVal" @input="debounceHandle(1000)"></el-input>
<el-text class="block text-left text-lg mb-[10px]!">{{debounceValShow}}</el-text>
    <h4>节流</h4>   
<CodeEditor class="my-[10px]" code="function throttleFn(fn,delay){
    let timer;
    return function(...args){
        const context = this;
        if(!timer) {
            timer = setTimeout(()=>{
                fn.apply(context, args)
                timer=null
            },delay)
        }
    }
}"/>
<CodeEditor code="function throttleFn(fn,delay){
    let last = 0;
    return function(...args){
        const context = this;
        const now = Date.now()
        if(now-last>=delay) {
            last=now
            fn.apply(context, args)
        }
    }
}"/>
<el-input class="my-[10px]" clearable type="text" v-model="throttleVal" @input="throttleHandle(1000)"></el-input>
<el-text class="block text-left text-lg mb-[10px]!">{{throttleValShow}}</el-text> 
</template>

<script setup>
import {onMounted, ref, getCurrentInstance} from "vue"
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
onMounted(()=>{
    console.log('debounceThrottling.vue');
})
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