<template>
    <ModalSearch v-if="isShowSearch" v-model="isShowSearch"/>
    <div class="layout">
        <div class="layout_menu" :class="{ collapsed: isCollapse }">
            <div class="layout_menu_logo" @click="goHome">
                <span v-show="!isCollapse">KNOWLEDGE ENGINE</span>
                <span v-show="isCollapse">K&E</span>
            </div>
            <div class="menu_scroll_container" ref="menuScrollContainerRef">
                <NativeMenu
                    :menu-config="menuConfig"
                    :collapse="isCollapse"
                    :active-path="onRoutes"
                    @menu-click="handleMenuClick"
                />
            </div>
            <div class="custome_menu_btn" @click="collapse">
                <el-icon v-if="!isCollapse"><DArrowLeft/></el-icon>
                <el-icon v-if="isCollapse"><DArrowRight/></el-icon>
                <span v-if="!isCollapse">收起</span>
            </div>
        </div>
        <div class="layout_container">
            <header>
                <div class="header_left">
                    
                </div>
                <div class="header_right">
                    <HeaderSearch @click="openSearchModal"/>
                    <ThemeSwitch/>
                    <el-dropdown placement="bottom" @command="handleCommand">
                        <el-avatar size="default" :src="`${preUrl}${userInfoStore.userInfo.avatar}`"></el-avatar>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item disabled>{{ userInfoStore.userInfo.name }}</el-dropdown-item>
                                <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                                <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </header>
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
    import NativeMenu from './components/NativeMenu.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { computed, onMounted,ref, onBeforeUnmount, nextTick } from 'vue'
    import useUserInfoStore from './store/pinia/userInfo'
    import { loginOutEffect } from '@/utils/tokenManager'
    import { toLoginOut } from '@/api/auth'
    import { findDefaultPath } from '@/utils/generateRoutes'

    const preUrl = `${import.meta.env.VITE_PROXY}`.replace(/\/$/, '')
    const userInfoStore = useUserInfoStore()
    const router = useRouter()
    const route = useRoute()
    const menuScrollContainerRef = ref(null)
    
    const onRoutes = computed(()=>{
        return route.path
    })
    
    // 从 localStorage 恢复收起状态
    const isCollapse=ref(JSON.parse(localStorage.getItem('menuCollapse') || 'false'))
    const menuConfig = ref([])

    const collapse = function(){
        isCollapse.value=!isCollapse.value
        // 保存收起状态
        localStorage.setItem('menuCollapse', JSON.stringify(isCollapse.value))
    }

    const goHome = () => {
        router.push(findDefaultPath(userInfoStore.menus))
    }

    const handleMenuClick = (path) => {
        // 保存当前菜单路径
        localStorage.setItem('currentMenuPath', path)
        // 保存当前滚动位置
        saveScrollPosition()
        router.push(path)
    }

    // 保存滚动位置
    const saveScrollPosition = () => {
        if (menuScrollContainerRef.value) {
            localStorage.setItem('menuScrollPosition', JSON.stringify({
                scrollTop: menuScrollContainerRef.value.scrollTop,
                scrollLeft: menuScrollContainerRef.value.scrollLeft
            }))
        }
    }

    // 恢复滚动位置
    const restoreScrollPosition = () => {
        const savedPosition = JSON.parse(localStorage.getItem('menuScrollPosition') || '{}')
        nextTick(() => {
            if (menuScrollContainerRef.value && savedPosition.scrollTop !== undefined) {
                menuScrollContainerRef.value.scrollTop = savedPosition.scrollTop
                menuScrollContainerRef.value.scrollLeft = savedPosition.scrollLeft
            }
        })
    }

    // 滚动时自动保存位置
    const handleScroll = () => {
        saveScrollPosition()
    }

    let isShowSearch = ref(false)
    // 打开搜索模态框
    const openSearchModal = ()=>{
        isShowSearch.value = true
    }
    const handleCommand = function(command){
        if(command=='loginOut'){
            toLoginOut({}).then(res=>{
                if(res.code==200){
                    loginOutEffect()
                }
            })
        }else if(command=='userInfo'){
            router.push('/userInfo')
        }
    }
    // 初始化
    onMounted(()=>{
        menuConfig.value = userInfoStore.menus
        // 恢复滚动位置
        restoreScrollPosition()
        // 绑定滚动事件
        if (menuScrollContainerRef.value) {
            menuScrollContainerRef.value.addEventListener('scroll', handleScroll)
        }
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
    
    onBeforeUnmount(() => {
        // 移除滚动事件
        if (menuScrollContainerRef.value) {
            menuScrollContainerRef.value.removeEventListener('scroll', handleScroll)
        }
    })
</script>

<style lang="scss">
@use "@/styles/home.scss";
</style>
