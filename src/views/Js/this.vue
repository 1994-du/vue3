<template>
<h4>this指向</h4>
<code>
    <pre>var year = 2021</pre>
    <pre>function getDate(month,day){</pre>
    <pre>   return this.year + '-' + month + '-' +day</pre>
    <pre>}</pre>
    <pre>var date1 = getDate(1,1) // 2021-1-1</pre>
</code>
<h4>call和apply作用一样，区别就是参数区别；apply参数为数据</h4>
<code>
    <pre>getDate.call({year:2022},1,1) // 2022-1-1</pre>
</code>
<code>
    <pre>getDate.apply({year:2023},[1,1]) // 2023-1-1</pre>
</code>
<h4>bind是返回函数 不会立即调用</h4>
<code>
    <pre>let newFun = getDate.bind({year:2024})(1,1)</pre>
    <pre>newFun() // 2024-1-1</pre>
</code>
</template>
<script setup>
import heighCode from "@/utils/highCode"
import { onMounted } from "vue"
onMounted(()=>{
    heighCode()
})
</script>
<style lang='scss' scoped>
</style>