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
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 路由分组
    const routesGroup = (list)=>{
        let res = {}
        list.forEach((item)=>{
            if(item.meta.groupName){
                if(!res[item.meta.groupName]){
                    res[item.meta.groupName] = []
                    res[item.meta.groupName].push({
                        menuName: item.name,
                        menuLink: item.path,
                    })
                }else{
                    res[item.meta.groupName].push({
                        menuName: item.name,
                        menuLink: item.path,
                    })
                }
                
            }
        })
        return res
    }
    let routeRes = routesGroup(router.getRoutes())
    // 菜单数据
    const menuData = Object.keys(routeRes).map((item)=>{
        return {
            menuName: item,
            menuLink: routeRes[item].length>1?'':routeRes[item][0].menuLink,
            children: routeRes[item].length>1?routeRes[item]:null
        }
    })
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
    onMounted(()=>{
        menuConfig.value=menuData
    })
</script>

<style lang="scss">
@import "@/styles/home.scss";
</style>