<template>
  <div class="provideInject">
    <el-text class="block text-lg! text-left pb-[10px]!">provide/inject:依赖注入</el-text>
    <CodeEditor class="pb-[10px]" code="import { provide, reactive } from 'vue';
// 提供响应式数据
const state = reactive({
  count: 0
});
// 提供数据给后代组件
provide('state', state);"/>
        
    <CodeEditor code="import { inject } from 'vue';
// 注入数据
const state = inject('state');"/>
  </div>
</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>