<template>
    <h4>数组去重</h4>
    <p>方法一：利用Set</p>
    <code>
        <pre>let arr = [1,2,3,2,4,1,3,6,5]</pre>
        <pre>let newArr = Array.from(new Set(arr))</pre>
        <pre>// 或者</pre>
        <pre>let newArr = [...new Set(arr)];</pre>
    </code>
    <p>方法二：利用filter</p>
    <code>
        <pre>let arr=[1,2,3,2,4,1,3,6,5]]</pre>
        <pre>let newArr = arr.filter((item,index,self)=>self.indexOf(item)===index)</pre>
    </code>
    <p>方法三：利用reduce</p>
    <code>
        <pre>let arr=[1,2,3,2,4,1,3,6,5]]</pre>
        <pre>let newArr = arr.reduce((pre,cur)=>pre.includes(cur)?pre:[...pre,cur],[])</pre>
    </code>
</template>
<script setup>
let arr = [1,2,3,2,4,1,3,6,5];
// let newArr = arr.filter((item,index,self)=>self.indexOf(item)===index)
let newArr = arr.reduce((pre,cur)=>pre.includes(cur)?pre:[...pre,cur],[])
console.log(newArr);


</script>
<style lang='scss' scoped>

</style>