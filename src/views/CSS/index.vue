<template>
    <h4>preprocessor:预处理器</h4>
    <div class="flex flex-col items-start justify-start">
        <el-text type="primary" size="large">less</el-text>
        <el-text type="primary" size="large">sass scss</el-text>
    </div>
    <div class="flex flex-col items-start justify-start">
        <p>less定义变量：@color:red;</p>
        <p>sass定义变量：$color:red;</p>
    </div>
    
</template>
<script setup>
</script>
<style lang='scss' scoped>
$color:red;
.vue3-text{
    align-self: flex-start;
}
</style>
<style lang="less" scoped>
@color:green;
.vue3-text{
    align-self: flex-start;
}
</style>