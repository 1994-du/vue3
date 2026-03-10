<template>
    <ModalSearch v-if="isShowSearch" v-model="isShowSearch"/>
    <div class="layout">
        <div class="layout_menu">
            <div class="layout_menu_logo" @click="router.push('/home')">
                <span v-show="!isCollapse">KNOWLEDGE ENGINE</span>
                <span v-show="isCollapse">K&E</span>
            </div>
            <el-menu
                @select="handleMenuSelect"
                router
                :default-active="onRoutes"
                :collapse="isCollapse"
                :style="{width:!isCollapse?'250px':''}"
                :collapse-transition="false">
                <SubMenu v-for="(item,index) in menuConfig" :key="index" :menus="item"/>
            </el-menu>
            <!-- <div class="custome_menu_btn" @click="router.push('/set')">
                <el-icon v-if="!isCollapse"><Setting /></el-icon>
                <el-icon v-if="isCollapse"><Setting /></el-icon>
                <span v-if="!isCollapse">设置</span>
            </div> -->
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
    import SubMenu from './components/subMenu.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { computed, onMounted,ref, nextTick, watch } from 'vue'
    import { useStore } from 'vuex'
    import menuRoutes from '@/utils/menuRoutes'
    import useUserInfoStore from './store/pinia/userInfo'
    import { clearToken,clearTokenCheckTimer } from '@/utils/tokenManager'
    import { toLoginOut } from '@/api/api'

    const preUrl = `${import.meta.env.VITE_BASE_URL}`
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
        console.log(index,indexPath);
        router.push(indexPath.join(''))
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
        }else if(command=='userInfo'){
            router.push('/userInfo')
        }
    }
    // 初始化
    onMounted(()=>{
        // let arr = []
        // router.getRoutes().forEach(el=>{
        //     if(el.meta.groupName){
        //         let res = arr.find(ml=>ml?.groupName==el.meta.groupName)
        //         if(res){
        //             res.children[0]={
        //                 groupName:res.groupName,
        //                 menuName:res.menuName,
        //                 menuLink:res.menuLink
        //             }
        //             res.children.push({
        //                 groupName:el.meta.groupName,
        //                 menuName:el.name,
        //                 menuLink:el.path,
        //                 children:[]
        //             })
        //         }else{
        //             arr[el.meta.index]={
        //                 groupName:el.meta.groupName,
        //                 menuName:el.name,
        //                 menuLink:el.path,
        //                 children:[]
        //             }
        //         }
        //     }
        // })
        // menuConfig.value = arr
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
        
        // 初始加载时滚动到当前菜单
        nextTick(() => {
            scrollToActiveMenu()
        })
    })
    
    // 监听路由变化，滚动到当前菜单
    // watch(
    //     () => route.path,
    //     () => {
    //         nextTick(() => {
    //             scrollToActiveMenu()
    //         })
    //     }
    // )
    
    // 滚动到当前激活的菜单
    const scrollToActiveMenu = () => {
        try {
            // 增加小延迟，确保DOM完全渲染
            setTimeout(() => {
                // 查找当前激活的菜单项
                const activeMenu = document.querySelector('.vue3-menu-item.is-active')
                
                if (activeMenu) {
                    // 查找真正的菜单滚动容器 (.vue3-menu)
                    const menuContainer = document.querySelector('.vue3-menu')
                    if (menuContainer) {
                        // 计算菜单项相对于滚动容器的位置
                        const menuRect = activeMenu.getBoundingClientRect()
                        menuContainer.scrollTo({
                            top: menuRect.top - 200,
                            behavior: 'smooth'
                        })
                    } else {
                        console.warn('Menu container not found')
                    }
                } else {
                    console.warn('Active menu item not found')
                }
            }, 300)
        } catch (error) {
            console.error('Error scrolling to active menu:', error)
        }
    }
</script>

<style lang="scss">
@use "@/styles/home.scss";
</style>