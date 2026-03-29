<template>
    <h4>判断是否为空对象</h4>
    <CodeEditor code="let obj={}
Object.keys(obj).length===0
JSON.stringify(obj)==='{}'
// 如果对象属性为Symbol，需要使用Reflect api
let obj={[Symbol()]:1}
Reflect.ownKeys(obj).length===0" />
</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>