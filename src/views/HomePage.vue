<template>
    <el-collapse>
        <el-collapse-item title="依赖版本">
            <p>当前 <span>node</span> 版本为 16.15.0</p>
            <p>当前 <span>npm</span> 版本为 8.5.5</p>
            <p>当前 <span>@vue/cli</span> 版本为 5.0.4</p>
            <p>当前 <span>vue</span> 版本为 3.2.37</p>
            <p>当前 <span>vue-router</span> 版本为 4.1.3</p>
            <p>当前 <span>vuex</span> 版本为 4.0.2</p>
            <p>当前代码保存在gitee，并自动同步（也可以手动同步）到github</p>
        </el-collapse-item>
        <el-collapse-item title="vue2和vue3的区别">
            <h5>1.生命周期</h5>
            <p>vue3使用生命周期前需要引入且可拆分多个</p>
            <h5>2.支持多个根节点</h5>
            <h5>3.vue2是选项API、vue3是组合式API</h5>
            <h5>4.异步组件</h5>
            <h5>5.响应式原理不同</h5>
            <p>vue2是Object.defineProperty、vue3是Proxy</p>
            <p>vue2局限性，无法监听对象或数组新增、删除的元素</p>
        </el-collapse-item>
        <el-collapse-item title="Object.defineProperty和Proxy的区别">
            <p></p>
            <p>1.Proxy性能优于Object.defineProperty。Proxy代理的是整个对象，Object.defineProperty只代理对象上的某个属性，如果是多层嵌套的数据，需要循环递归绑定</p>
            <p>2.对象上定义新属性时，Proxy可以监听到，Object.defineProperty监听不到，需要借助$set方法</p>
            <p>3.数组的某些方法（push、unshift、splice）Object.defineProperty监听不到；Proxy可以监听到</p>
            <p>4.Proxy在ie浏览器存在兼容性问题</p>
        </el-collapse-item>
        <el-collapse-item title="vue优点">
            <p>1.组件化开发，减少代码量</p>
            <p>2.视图view、数据model、逻辑viewmodel <br>
                viewmodel:<br>Observer-监听器；对所有数据的属性进行监听。<br> Compiler-解析器；对每个元素节点进行扫描解析，根据指令模板替换数据并绑定响应的更新函数
            </p>
            <p>3.数据响应式：数据改变视图随之更新。vue2：Object.property、vue3:Proxy</p>
            <p>4.数据双向绑定：v-model</p>
        </el-collapse-item>
    </el-collapse>
</template>

<script setup>
import {useStore}from 'vuex'
import { useRouter } from 'vue-router';
import { onMounted } from '@vue/runtime-core';
const router = useRouter()
const store = useStore();

onMounted(()=>{})
</script>

<style lang="less">
@import './../styles/home_page.less';
</style>
