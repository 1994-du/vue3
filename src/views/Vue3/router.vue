<!--  -->
<template>
<div class="use_router">
    <h2>一、创建路由文件</h2>
    <p>1.路由文件 router/index.js</p>
    <p>2.所有路由地址 router/routes.js</p>
    <h2>二、使用路由</h2>
</div>
</template>

<script setup>
import {useRouter,useRoute} from 'vue-router'
import {useStore} from 'vuex'
const store = useStore()
const route = useRoute()
const router = useRouter()//全局路由对象
const allRoutes = router.getRoutes()//所有路由地址
const currentRouter = router.currentRoute.value //当前路由对象
// console.log(store,route,allRoutes,currentRouter)
</script>
<style lang='less' scoped>
</style>