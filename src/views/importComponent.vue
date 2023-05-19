<template>
    <h1>组件引入</h1>
    <h4>vue3.0引入组件</h4>
    <highlightjs code="<menuSearchResult>自定义内容</menuSearchResult>
<script>
import menuSearchResult from '@/components/menuSearchResult.vue';
export default{
    components:{
        menuSearchResult
    }
}
</script>"></highlightjs>
    <h4>vue3.2引入组件</h4>
    <highlightjs code="<menuSearchResult>自定义内容</menuSearchResult>
<script setup>
    import menuSearchResult from '@/components/menuSearchResult.vue';
</script>"></highlightjs>
</template>
<script setup>
</script>
<style lang="less" scoped>
*{
    text-align: left;
}
</style>