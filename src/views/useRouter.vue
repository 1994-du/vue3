<!--  -->
<template>
<div class="use_router">
    <h2>一、创建路由文件</h2>
    <p>1.路由文件 router/index.js</p>
    <img src="/static/image/router-index.png" alt="">
    <p>2.所有路由地址 router/routes.js</p>
    <img src="/static/image/router-routes.png" alt="">
    <h2>二、使用路由</h2>
    <img src="/static/image/router-useRouter.png" alt="">
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
h2,p{
    text-align: left;
}
img {
    width: 100px;
    transition: all 2s;
}
.use_router{
    display: flex;
    flex-direction: column;
    
}
</style>