<template>
    <ModalSearch v-if="isShowSearch" v-model="isShowSearch"/>
    <div class="layout">
        <div class="layout_menu" :class="{ collapsed: isCollapse }">
            <div class="layout_menu_logo" @click="goHome">
                <span v-show="!isCollapse">KNOWLEDGE ENGINE</span>
                <span v-show="isCollapse">K&E</span>
            </div>
            <div class="menu_scroll_container">
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
    import { computed, onMounted,ref } from 'vue'
    import useUserInfoStore from './store/pinia/userInfo'
    import { loginOutEffect } from '@/utils/tokenManager'
    import { toLoginOut } from '@/api/auth'
    import { getDefaultRoutePath } from '@/utils/menuRoute'

    const preUrl = `${import.meta.env.VITE_PROXY}`.replace(/\/$/, '')
    const userInfoStore = useUserInfoStore()
    const router = useRouter()
    const route = useRoute()
    const onRoutes = computed(()=>{
        return route.path
    })
    const isCollapse=ref(false)
    const menuConfig = ref([])

    const collapse = function(){
        isCollapse.value=!isCollapse.value
    }

    const goHome = () => {
        router.push(getDefaultRoutePath(userInfoStore.menus))
    }

    const handleMenuClick = (path) => {
        router.push(path)
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
@use "@/styles/home.scss";
</style>
