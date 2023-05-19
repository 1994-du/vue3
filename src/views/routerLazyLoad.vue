<!--  -->
<template>
    <h4>路由懒加载</h4>
    <p>将不同的路由对应的文件打包成一个个的js代码块</p>
    <p>1.component:resolve=>require(['@/index.vue'],resolve)</p>
    <p>2.component:()=>import('@/index.vue')</p>
    <p>3.const index =()=>import('@/index.vue')<br>
        component:index
    </p>
    <p>4.import index from "@/index.vue"<br>
    
        component:index</p>
</template>

<script setup>
</script>
<style lang="less" scoped>
h2 , p{
    text-align: left;
}
</style>