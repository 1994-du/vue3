<template>
    <div class="layout">
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
    
</template>
<!-- <template>
    login
</template> -->
<script setup>
    import {useRouter} from 'vue-router'
    import {computed, onMounted, onBeforeMount, onUpdated, onUnmounted, onBeforeUnmount,getCurrentInstance,ref,watch,watchEffect} from 'vue'
    const { proxy } = getCurrentInstance()
    const router=useRouter()
    let searchKey = ref('');//搜索关键字
    let currentRouter = ref('')//当前路由
    const menus = computed(()=>{
        return router.getRoutes().filter(el=>el.path!='/'&&el.path!='/login')
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
        if(!token){
            
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