<template>
    <ModalSearch v-if="isShowSearch" v-model="isShowSearch"/>
    <div class="layout">
        <div class="layout_menu">
            <el-menu
                @select="handleMenuSelect"
                router
                :default-active="onRoutes"
                :collapse="isCollapse"
                :style="{width:!isCollapse?'250px':''}"
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
        <div class="container">
            
            <header>
                <div class="header_left">
                    <HeaderSearch @click="openSearchModal"/>
                    <ThemeSwitch/>
                </div>
                <div class="header_right">
                    <el-avatar size="small" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                    
                    <el-dropdown placement="bottom" @command="handleCommand">
                        <span>{{ userInfoStore.userInfo.name }}</span>
                        <template #dropdown>
                            <el-dropdown-menu>
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
    import SubMenu from './components/subMenu.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { computed, onMounted,ref } from 'vue'
    import { useStore } from 'vuex'
    import menuRoutes from '@/utils/menuRoutes'
    import useUserInfoStore from './store/pinia/userInfo'
    import { clearToken,clearTokenCheckTimer } from '@/utils/tokenManager'
    import { toLoginOut } from '@/api/api'
    const userInfoStore = useUserInfoStore()
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
    const handleCommand = function(command){
        if(command=='loginOut'){
            toLoginOut({}).then(res=>{
                if(res.code==200){
                    clearToken()
                    clearTokenCheckTimer()
                    router.push('/login')
                }
            })
        }
    }
    // 初始化
    onMounted(()=>{
        // menuConfig.value = menuRoutes
        console.log(router.getRoutes());
        let arr = []
        router.getRoutes().forEach(el=>{
            if(el.meta.groupName){
                let res = arr.find(ml=>ml?.groupName==el.meta.groupName)
                if(res){
                    res.children[0]={
                        groupName:res.groupName,
                        menuName:res.menuName,
                        menuLink:res.menuLink
                    }
                    res.children.push({
                        groupName:el.meta.groupName,
                        menuName:el.name,
                        menuLink:el.path,
                        children:[]
                    })
                }else{
                    arr[el.meta.index]={
                        groupName:el.meta.groupName,
                        menuName:el.name,
                        menuLink:el.path,
                        children:[]
                    }
                }
            }
        })
        console.log('arr',arr);
        menuConfig.value = arr
        
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