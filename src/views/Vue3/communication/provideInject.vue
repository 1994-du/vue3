<template>
  <div class="provideInject">
    <h1>provide/inject</h1>
    <code>
        <pre>import { provide, reactive } from 'vue';</pre>
        <pre>// 提供响应式数据</pre>
        <pre>const state = reactive({</pre>
        <pre>  count: 0</pre>
        <pre>});</pre>
        <pre>// 提供数据给后代组件</pre>
        <pre>provide('state', state);</pre>
    </code>
    <code>
        <pre>import { inject } from 'vue';</pre>
        <pre>// 注入数据</pre>
        <pre>const state = inject('state');</pre>
    </code>
  </div>
</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>