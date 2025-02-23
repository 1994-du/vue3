<template>
    <h1>vue-router原理</h1>
    <h2>hash模式</h2>
    <code>
        <pre>通过URL的#（哈希符号）来管理页面状态</pre>
        <pre>监听hashchange事件</pre>
    </code>
    <h2>history模式</h2>
    <code>
        <pre>通过HTML5的history API来实现URL的变化</pre>
        <pre>监听popstate事件</pre>
        <pre>state：参数</pre>
        <pre>title：标题</pre>
        <pre>url：URL地址</pre>
        <pre>history.pushState(state, title, url)
history.replaceState(state, title, url)
history.back()
history.forward()
history.go(n)
        </pre>
    </code>
</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>