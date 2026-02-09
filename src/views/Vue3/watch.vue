<template>
    <div class="watch">
        <p>三个参数：目标、回调函数、选项对象</p>
        <p>选项对象：immediate:true 表示立即执行回调函数</p>
        <p>选项对象：deep:true 表示深度监听</p>
        <p>回调函数：参数newVal,oldVal 表示新值和旧值</p>
        <p>回调函数：onCleanup 表示组件卸载时执行的函数</p>
    </div>
</template>

<script setup>
import { watch,ref, reactive } from 'vue';
let num = ref(0)
let num2 = ref(2)
let single = reactive({a:1,b:2})
let single2 = reactive({c:1,d:2})
watch(num,
(newVal,oldVal)=>{
    console.log(newVal,oldVal);
},
{
    immediate:true
})
watch([num,num2],
(newVal,oldVal)=>{
    console.log(newVal,oldVal);
},
{
    immediate:true
})
watch(single,
(newVal,oldVal)=>{
    console.log(newVal,oldVal);
},
{
    immediate:true
})
watch([single,single2],
(newVal,oldVal)=>{
    console.log(newVal,oldVal);
},
{
    immediate:true
})
const add=()=>{
    single.a+=1
}
</script>
