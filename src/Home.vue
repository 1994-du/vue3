<template>
    <div class="layout">
        <header>
            <div class="userinfo">
                <span>{{ userInfo.value.name }}</span>
                <img :src="userInfo.value.avatar" alt="">
            </div>
            <!-- <span>传入的消息、发送的消息{{ $t('common.login') }}</span> -->
            <div class="operation">
                <img class="set" src="/static/image/set.png" alt="" @click="$router.push('/set')">
                <img class="set" src="/static/image/logout.png" alt="" @click="dialogVisibleLoginOut=true">
            </div>
        </header>
        <div class="container">
            <el-scrollbar>
                <div class="layout_menu">
                    <el-autocomplete
                        v-model="searchKey"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        clearable
                        class="inline-input w-50"
                        placeholder="搜索关键字"
                        @select="handleSelect"
                        ref="searchIpt"
                    />
                    <el-menu>
                        <el-menu-item
                            v-for="(menuitem,index) in menus" 
                            :key="menuitem.meta.name+index"
                            :index="menuitem.meta.name+index"
                            @click="toPage(menuitem)">
                            <span>{{menuitem.meta.name}}</span>
                        </el-menu-item>
                    </el-menu>
                    <div class="drop_box" @mousedown="menuMouseDown"></div>
                </div>
            </el-scrollbar>
            <div class="layout_content">
                <router-view></router-view>
            </div>
            <div class="toTop" @click="toTop">
                <img src="/static/image/toTop.svg" alt="">
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
    import {useRouter} from 'vue-router'
    import {computed, onMounted, onBeforeMount, onUpdated, onUnmounted, onBeforeUnmount,getCurrentInstance,ref,watch,watchEffect, reactive, onActivated} from 'vue'
    import {useStore} from 'vuex'
    const store = useStore()
    const { proxy } = getCurrentInstance()
    const router=useRouter()
    let searchKey = ref('');//搜索关键字
    let userInfo = reactive({
        value:{}
    });//用户信息
    let dialogVisibleLoginOut = ref(false)//退出登录提示
    const menus = computed(()=>{
        let filterPath=['/','/login','/set']
        return router.getRoutes().filter(el=>!filterPath.includes(el.path))
    })
    //搜索建议
    const querySearch=function(str,cb){
        let suggest=[]
        menus.value.forEach(el=>{
            if(~el.meta.name.toLowerCase().indexOf(str.toLowerCase())){
                suggest.push({
                    value:el.meta.name,
                    link:el.path
                })
            }
        })
        cb(suggest)
    }
    //选取菜单
    const handleSelect=function(item){
        router.push(item.link)
        searchKey.value=''
    }
    //菜单点击事件
    const toPage=function(menu) {
        router.push(menu.path)
    }
    const searchIpt = ref()
    //回到顶部
    const toTop=()=>{
        let wrap = document.getElementsByClassName('layout_menu')[0];
        wrap.scrollIntoView({
            behavior:'smooth'
        })
    }
    //鼠标按下事件
    const menuMouseDown=(e)=>{
        let wrap = document.getElementsByClassName('layout_menu')[0];
        let wrapWidth = wrap.offsetWidth;
        let startX = e.clientX;
        document.onmousemove=(e)=>{
            let currentX = e.clientX;
            let changeX = currentX-startX;
            wrap.style.width=wrapWidth+changeX+'px'
        }
        document.onmouseup=(e)=>{
            e.stopPropagation();
            document.onmousemove = null;
            document.onmouseup = null;
            //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
            e.releaseCapture && e.releaseCapture();
        }
    }
    // 退出登录
    const toLoginOut=()=>{
        sessionStorage.removeItem('token')
        proxy.$router.push('/login')
        dialogVisibleLoginOut.value=false;
    }
    onBeforeMount(()=>{})
    onMounted(()=>{})
    onActivated(()=>{
        console.log('activated');
        let token = sessionStorage.getItem('token')
        if(token){
            userInfo.value=JSON.parse(token)
        }
    })
    onUpdated(()=>{})
    onBeforeUnmount(()=>{})
    onUnmounted(()=>{})
</script>

<style lang="less">
@import "@/styles/home.less";
</style>