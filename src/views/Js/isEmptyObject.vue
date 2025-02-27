<template>
    <h4>判断是否为空对象</h4>
    <code>
        <pre>let obj={}</pre>
        <pre>1.Object.keys(obj).length===0</pre>
        <pre>2.JSON.stringify(obj)==='{}'</pre>
    </code>
    <code>
        <pre>// 如果对象属性为Symbol，需要使用Reflect api</pre>
        <pre>let obj={[Symbol()]:1}</pre>
        <pre>3.Reflect.ownKeys(obj).length===0</pre>
    </code>
</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>