<template>
<h4>事件循环</h4>
<code>
    <pre>事件循环（Event Loop）是 JavaScript 中的一个核心概念，它是 JavaScript 执行异步代码的机制</pre>
    <pre>事件循环是 JavaScript 引擎用来管理执行栈和任务队列的机制。它的工作流程如下：
1.执行栈为空：事件循环会检查任务队列是否有任务。
2.任务队列有任务：如果队列中有任务，事件循环将会把第一个任务从队列中取出，推入执行栈，开始执行。
3.重复步骤 1 和 2：这个过程会一直重复，直到任务队列为空。</pre>
</code>
<code>
    <pre>异步任务分为：宏任务和微任务</pre>
    <pre>宏任务：
•setTimeout、setInterval、setImmediate（Node.js 环境）
•UI 渲染（如浏览器绘制）
•用户交互事件（如点击、输入等）</pre>
    <pre>微任务：
•Promise 的 .then()、.catch()、.finally() 回调
•MutationObserver
•queueMicrotask（用来手动将任务添加到微任务队列）</pre>
</code>
</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>