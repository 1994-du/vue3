<template>
    <div class="footer">
        <el-button @click="goBack">返回</el-button>
    </div>
</template>
<script setup lang="ts" name="Footer">
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
.footer{
    height: 80px;
    width: 100%;
    filter:drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.1));
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    z-index: 3;
    display: flex;
    align-items: center;
    padding: 0 20px;
}
</style>