<template>
    <ModalSearch v-if="isShowSearch" v-model="isShowSearch"/>
    <div class="layout">
        <header>
            <HeaderSearch @click="openSearchModal"/>
            <ThemeSwitch/>
        </header>
        <div class="container">
            <div class="layout_menu">
                <el-menu
                    @select="handleMenuSelect"
                    router
                    :default-active="onRoutes"
                    :collapse="isCollapse"
                    :style="{width:!isCollapse?'280px':''}"
                    :collapse-transition="false">
                    <SubMenu v-for="(item,index) in menuConfig" :key="index" :menus="item"/>
                </el-menu>
                <div class="custome_menu_btn" @click="router.push('/set')">
                    <el-icon v-if="!isCollapse"><Setting /></el-icon>
                    <el-icon v-if="isCollapse"><Setting /></el-icon>
                    <span v-if="!isCollapse">设置</span>
                </div>
                <div class="custome_menu_btn" @click="collapse">
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
    import ModalSearch from '@/components/ModalSearch.vue'
    import HeaderSearch from './components/HeaderSearch.vue'
    import ThemeSwitch from '@/components/ThemeSwitch.vue'
    import SubMenu from './components/subMenu.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { computed, onMounted,ref } from 'vue'
    import { useStore } from 'vuex'
    import menuRoutes from '@/utils/menuRoutes'
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

    let isShowSearch = ref(false)
    // 打开搜索模态框
    const openSearchModal = ()=>{
        isShowSearch.value = true
    }
    // 初始化
    onMounted(()=>{
        menuConfig.value = menuRoutes

        window.addEventListener('keydown', (e) => {
            if((e.ctrlKey||e.metaKey) && e.key === 'f'){
                e.preventDefault()
                isShowSearch.value = true
            }
            if(e.key === 'Escape'){
                isShowSearch.value = false
            }
        })
    })
</script>

<style lang="scss">
@import "@/styles/home.scss";
</style>