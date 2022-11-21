<template>
    <div class="home_wrap">
        <div class="home_page">
            <p>当前 <span>node</span> 版本为 16.15.0</p>
            <p>当前 <span>npm</span> 版本为 8.5.5</p>
            <p>当前 <span>@vue/cli</span> 版本为 5.0.4</p>
            <p>当前 <span>vue</span> 版本为 3.2.37</p>
            <p>当前 <span>vue-router</span> 版本为 4.1.3</p>
            <p>当前 <span>vuex</span> 版本为 4.0.2</p>
            <p>当前代码保存在gitee，并自动同步（也可以手动同步）到github</p>
        </div>
        <div class="home_page">
            <p>vue2和vue3的区别</p>
            <h5>1.生命周期</h5>
            <p>vue3使用生命周期前需要引入且可拆分多个</p>
            <h5>2.支持多个根节点</h5>
            <h5>3.vue2是选项API、vue3是组合式API</h5>
            <h5>4.异步组件</h5>
            <h5>5.响应式原理不同</h5>
            <p>vue2是Object.defineProperty、vue3是Proxy</p>
            <p>vue2局限性，无法监听对象或数组新增、删除的元素</p>
        </div>
        <div class="home_page">
            <p>webpack和vite的区别</p>
            <h5>1.生命周期</h5>
            <p>vue3使用生命周期前需要引入且可拆分多个</p>
            <h5>2.支持多个根节点</h5>
            <h5>3.vue2是选项API、vue3是组合式API</h5>
            <h5>4.异步组件</h5>
            <h5>5.响应式原理不同</h5>
            <p>vue2是Object.defineProperty、vue3是Proxy</p>
            <p>vue2局限性，无法监听对象或数组新增、删除的元素</p>
        </div>
    </div>
</template>

<script setup>
const { onMounted }=require("@vue/runtime-core");

onMounted(()=>{})
</script>

<style lang="less">
@import './../styles/home_page.less';
</style>
