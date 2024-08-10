<template>
    <div class="layout">
        <div class="container">
            <div class="layout_menu">
                <el-menu
                    @select="handleMenuSelect"
                    router
                    :default-active="onRoutes"
                    :collapse="isCollapse"
                    :style="{width:!isCollapse?'200px':''}"
                    :collapse-transition="false">
                    <SubMenu v-for="(item,index) in menuConfig" :key="index" :menus="item"/>
                </el-menu>
                <div class="collapse_btn" @click="collapse">
                    <el-icon v-if="!isCollapse"><DArrowLeft/></el-icon>
                    <el-icon v-if="isCollapse"><DArrowRight/></el-icon>
                    <span v-if="!isCollapse">收起</span>
                </div>
            </div>
            <div class="layout_content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script setup>
    import SubMenu from './components/subMenu.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { computed, onMounted, onBeforeMount, onUpdated, onUnmounted, onBeforeUnmount, getCurrentInstance, ref, watch, watchEffect, reactive, onActivated } from 'vue'
    import { useStore } from 'vuex'
    import menuData from './mock/menuData.js'
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const onRoutes = computed(()=>{
        return route.path
    })
    const isCollapse=ref(false)
    const menuConfig = ref([])
    // 菜单
    const handleMenuSelect=function(index,indexPath){
        router.push(index)
    }
    const collapse = function(){
        isCollapse.value=!isCollapse.value
    }
    // 根据路由获取菜单
    const getMenuInRoutes = ()=>{
        menuConfig.value=menuData
    }
    onMounted(()=>{
        getMenuInRoutes()
    })
</script>

<style lang="less">
@import "@/styles/home.less";
</style>