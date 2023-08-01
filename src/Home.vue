<template>
    <div class="layout">
        <header>
            <div class="userinfo">
                <span>{{ userInfo.name }}</span>
                <img :src="userInfo.avatar" alt="">
            </div>
            <span>传入的消息、发送的消息</span>
            <div class="operation">
                
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="消息"
                    placement="top"
                >
                    <el-badge :value="message.length==0?'':message.length" class="item">
                        <img src="/static/image/remind.png" alt="" @click="$router.push('/websocket')">
                    </el-badge>
                </el-tooltip>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="设置"
                    placement="top"
                >
                    <img class="set" src="/static/image/set.png" alt="">
                </el-tooltip>
                <el-popconfirm title="确定退出登录?">
                    <template #reference>
                        <!-- <el-tooltip
                            class="box-item"
                            effect="dark"
                            content="退出登录"
                            placement="top"
                        >
                            <img class="set" src="/static/image/logout.png" alt="">
                        </el-tooltip> -->
                        <img class="set" src="/static/image/logout.png" alt="">
                    </template>
                </el-popconfirm>
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
    
</template>
<script setup>
    import {useRouter} from 'vue-router'
    import {computed, onMounted, onBeforeMount, onUpdated, onUnmounted, onBeforeUnmount,getCurrentInstance,ref,watch,watchEffect, reactive} from 'vue'
    import {useStore} from 'vuex'
    const store = useStore()
    const { proxy } = getCurrentInstance()
    const router=useRouter()
    let searchKey = ref('');//搜索关键字
    let currentRouter = ref('')//当前路由
    let userInfo = reactive({})
    const menus = computed(()=>{
        return router.getRoutes().filter(el=>el.path!='/'&&el.path!='/login')
    })
    const message = computed(()=>{
        console.log(store.state.message);
        return store.state.message
    })
    console.log('message',message);
    watch(message,(newVal,oldVal)=>{
        console.log('store',newVal );
    })
    watch(()=>router.currentRoute.value.path,(newVal,oldVal)=>{
        currentRouter.value=newVal;
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
    onBeforeMount(()=>{
        let token = localStorage.getItem('token')
        if(token){
            userInfo=JSON.parse(token)
            console.log(userInfo.userInfo);
        }
    })
    onMounted(()=>{})
    onUpdated(()=>{})
    onBeforeUnmount(()=>{})
    onUnmounted(()=>{})
</script>

<style lang="less">
@import "@/styles/home.less";
</style>