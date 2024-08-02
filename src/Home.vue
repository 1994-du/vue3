<template>
    <div class="layout">
        <header>
            <div class="userinfo">
                <span>{{ userInfo.value.name }}</span>
                <img :src="userInfo.value.avatar" alt="">
            </div>
            <div class="operation">
                <img class="set" src="/static/image/set.png" alt="" @click="$router.push('/set')">
                <img class="set" src="/static/image/logout.png" alt="" @click="dialogVisibleLoginOut=true">
            </div>
        </header>
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
    <!-- 确认退出登录 -->
    <el-dialog
        v-model="dialogVisibleLoginOut"
        width="200px">
        <span>确认退出登录？</span>
        <template #header>
            <h6 class="dialog__headercon">提示</h6>
        </template>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="toLoginOut">{{$t('common.confirm')}}</el-button>
                <el-button @click="dialogVisibleLoginOut = false">{{ $t('common.cancel') }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
    import SubMenu from './components/subMenu.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { computed, onMounted, onBeforeMount, onUpdated, onUnmounted, onBeforeUnmount, getCurrentInstance, ref, watch, watchEffect, reactive, onActivated } from 'vue'
    import { useStore } from 'vuex'
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
    
    let userInfo = reactive({
        value:{}
    });//用户信息
    let dialogVisibleLoginOut = ref(false)//退出登录提示
    // 退出登录
    const toLoginOut=()=>{
        sessionStorage.removeItem('token')
        router.push('/login')
        dialogVisibleLoginOut.value=false;
    }
    onActivated(()=>{
        let token = sessionStorage.getItem('token')
        if(token){
            userInfo.value=JSON.parse(token)
        }
    })
    // 根据路由获取菜单
    const getMenuInRoutes = ()=>{
        // let menus=[]
        // let allRoute = router.getRoutes()
        // allRoute.forEach((item,index)=>{
        //     if(item.meta.groupName){
        //         if(menus.filter(el=>el.meta.name==item.meta.groupName).length==0){
        //             menus.push({
        //                 path:index,
        //                 meta:{
        //                     name:item.meta.groupName,
        //                 },
        //                 children:[item]
        //             })
        //         }else{
        //             menus.forEach(el=>{
        //                 if(el.meta.name==item.meta.groupName){
        //                     el.children.push(item)
        //                 }
        //             })
        //         }
        //     }
        // })
        // menuConfig.value=menus


        menuConfig.value=store.state.menuData

        console.log(store.state,menuConfig.value);
    }
    watch(()=>store.state,(newVal,oldVal)=>{
        console.log('watch');
        store.commit('READ_STATE')
    })
    const saveState = ()=>{
        store.commit('SAVE_STATE')
    }
    onMounted(()=>{
        getMenuInRoutes()
        window.addEventListener('beforeunload',saveState)
    })
    onUnmounted(()=>{
        window.removeEventListener('beforeunload',saveState)
    })
</script>

<style lang="less">
@import "@/styles/home.less";
</style>