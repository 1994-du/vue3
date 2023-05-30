<template>
    <h1>Watch</h1>
    <h4>vue2监听写法</h4>
<highlightjs code="
// 监听一个值
watch:{
    data1(newVal,oldVal){
        console.log(newVal,oldVal);
    },
    data2:{
        handler(newVal,oldVal){
            console.log(newVal,oldVal);
        },
        deep:true,
        immediate:true
    }
}
// 监听多个值（结合计算属性）
computed:{
    data3(){
        let {data1,data2} = this
        return {data1,data2}
    }
}
watch:{
    data3(newVal,oldVal){
        console.log(newVal,oldVal)
    }
}
"></highlightjs>
<h4>vue3监听ref</h4>
<highlightjs code="
let num = ref(0)
let num2 = ref(2)
// 监听一个值
watch(num,
(newVal,oldVal)=>{
    console.log(newVal,oldVal);
},
{
    immediate:true
})
// 监听多个值
watch([num,num2],
(newVal,oldVal)=>{
    console.log(newVal,oldVal);
},
{
    immediate:true
})
"></highlightjs>
<h4>vue3监听reactive</h4>
<highlightjs code="
let single = reactive({a:1,b:2})
let single2 = reactive({c:1,d:2})
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
"></highlightjs>
<button @click="add">+</button>
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
