<!--  -->
<template>
    <h4>防抖</h4>
    <el-input clearable type="text" v-model="debounceVal" @input="debounceHandle(1000)"></el-input>
    <el-row>
        <el-col :span="8">
            <code>
                <pre>// 防抖</pre>
                <pre>let debounceTimer;</pre>
                <pre>const debounceHandle = function(fn,delay){</pre>
                <pre>   if(debounceTimer){</pre>
                <pre>       clearTimeout(debounceTimer)</pre>
                <pre>   }</pre>
                <pre>   debounceTimer=setTimeout(()=>{</pre>
                <pre>       fn()</pre>
                <pre>   },delay)</pre>
                <pre>}</pre>
            </code>
        </el-col>
        <el-col :span="8">
            <code>
                <pre>function debounce(func, delay) {</pre>
                <pre>   let timer;</pre>
                <pre>   return function (...args) {</pre>
                <pre>       const context = this;</pre>
                <pre>       clearTimeout(timer);</pre>
                <pre>       timer = setTimeout(() => {</pre>
                <pre>           func.apply(context, args);</pre>
                <pre>       }, delay);</pre>
                <pre>   };</pre>
                <pre>}</pre>
            </code>
        </el-col>
        <el-col :span="8">
            <code>
                <pre>function debounce(func, delay, immediate = false) {</pre>
                <pre>   let timer;</pre>
                <pre>   return function(...args) {</pre>
                <pre>       const context = this;</pre>
                <pre>       const callNow = immediate && !timer;</pre>
                <pre>       clearTimeout(timer);</pre>
                <pre>       timer = setTimeout(()=>{</pre>
                <pre>           timer = null;</pre>
                <pre>           if(!immediate) func.apply(context, args);</pre>
                <pre>       },delay)</pre>
                <pre>       if(callNow) func.apply(context, args);</pre>
                <pre>   }</pre>
                <pre>}</pre>
            </code>
        </el-col>
    </el-row>
    <h4>节流</h4>
    <el-input v-focus clearable type="text" v-model="throttleVal" @input="throttleHandle(1000)"></el-input>
    <el-row>
        <el-col :span="8">
            <code>
                <pre>let throttleTimer;</pre>
                <pre>const throttleHandle=function(fn,delay){</pre>
                <pre>   if(!throttleTimer){</pre>
                <pre>       throttleTimer = setTimeout(()=>{</pre>
                <pre>           fn()</pre>
                <pre>           throttleTimer=null</pre>
                <pre>       },delay)</pre>
                <pre>   }</pre>
                <pre>}</pre>
            </code>
        </el-col>
        <el-col :span="8">
            <code>
                <pre>function throttleFn(func, delay) {</pre>
                <pre>   let timer;</pre>
                <pre>   return function(...args) {</pre>
                <pre>       const context = this;</pre>
                <pre>       if(!timer) {</pre>
                <pre>           timer = setTimeout(()=>{</pre>
                <pre>               func.apply(context, args);</pre>
                <pre>               timer=null</pre>
                <pre>           },delay)</pre>
                <pre>       }</pre>
                <pre>   }</pre>
                <pre>}</pre>
            </code>
        </el-col>
        <el-col :span="8">
            
        </el-col>
    </el-row>
    
</template>

<script setup>
import {onMounted, ref, getCurrentInstance} from "vue"
import heighCode from "@/utils/highCode"
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
    // let {proxy}=getCurrentInstance()
    // const codeElement = document.getElementsByTagName("pre");
    // console.log('codeElement',Array.from(codeElement),Array.from(codeElement).length);
    // Array.from(codeElement).forEach(element => {
    //     console.log(element);  
    //     element.innerHTML = proxy.$highlightCode(element.innerText);
    // })
    heighCode()
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