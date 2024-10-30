<template>
   <h4>ref</h4>
   <codePre>
    onMounted(()=>{
        console.log(testRef.value)
    })
    创建响应式的Number或String类型状态
    例如：const str=ref('')
   </codePre>
   <codePre>
    获取dom节点
    <!-- <div ref='testRef' style='width: 20px;height: 20px;'></div> -->
    
        const testRef =ref()
        onMounted(()=>{
            testRef.value.style.background='red'
            console.log(testRef.value)
        })
    
   </codePre>
<div ref="testRef" style="width: 20px;height: 20px;"></div>


   <h4>reactive</h4>
<highlightjs code="创建响应式的引用类型对象
例如：const obj=reactive({
    name:'dx',
    age:12
})"></highlightjs>
   <h4>toRefs</h4>
   <highlightjs code="将一个响应式对象（reactive），转换为普通对象，并将其属性转换为ref对象
vue3.0版本需要return
const obj=reactive({
    name:'dx',
    age:12
})
const obj2 = toRefs(obj)
console.log(obj2)
return{
    ...obj2
}
<template>{{ name }}--{{ age }}</template>

vue3.2有setup语法糖后不需要return导出
const {name,age}=toRefs(obj)
"></highlightjs>
</template>
<script setup>
import { ref, reactive ,toRefs,onMounted } from 'vue'
const testRef =ref();
const obj=reactive({
    name:'dx',
    age:12
})
const obj2 = toRefs(obj)
console.log(obj2)
onMounted(()=>{
    testRef.value.style.background='red';
})
</script>
<style lang="less" scoped>
*{
    text-align: left;
}
</style>