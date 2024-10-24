<!--  -->
<template>
    <h4>路由懒加载</h4>
    <highlightjs :code="$stripIndent`
        将不同的路由对应的文件打包成一个个的js代码块
        1.component:resolve=>require(['@/index.vue'],resolve)
        2.component:()=>import('@/index.vue')
        3.const index =()=>import('@/index.vue'); component:index
        4.import index from '@/index.vue'; component:index
    `"></highlightjs>
</template>

<script setup>
</script>
<style lang="less" scoped>
h2 , p{
    text-align: left;
}
</style>