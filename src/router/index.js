import { createWebHistory, createRouter } from "vue-router";
// 首页
// import HomePage from "@/views/HomePage.vue";
const HomePage = ()=>import('@/views/HomePage.vue')
// 命令行
import CommandLine from '@/views/CommandLine.vue';
// keyframes(关键帧)
import KeyFrames from "@/views/keyframes.vue";
// 浏览器内核
import BrowserCore from "@/views/browserCore.vue"
// git命令行
import gitLine from "@/views/gitLine.vue"
//Store
import useStore from "@/views/useStore.vue";
//Router
import useRouter from "@/views/useRouter.vue"
//Axios
import useAxios from "@/views/useAxios.vue"
const routes=[
    {
        path:'/',
        meta:{
            name:'首页'
        },
        // component:resolve=>require(['@/views/HomePage.vue'],resolve) //AMD写法
        component:()=>import('@/views/HomePage.vue')
    },
    {
        path:'/commandline',
        meta:{
            name:'cmd命令行'
        },
        component:()=>import('@/views/CommandLine.vue')
    },
    {
        path:'/keyframes',
        meta:{
            name:'关键帧'
        },
        component:()=>import('@/views/keyframes.vue')
    },
    {
        path:'/browsercore',
        meta:{
            name:'浏览器内核'
        },
        component:()=>import('@/views/browserCore.vue')
    },{
        path:'/gitLine',
        meta:{
            name:'git命令行'
        },
        component:()=>import('@/views/gitLine.vue')
    },
    {
        path:'/useStore',
        meta:{
            name:'Store'
        },
        component:()=>import('@/views/useStore.vue')
    },
    {
        path:'/useRouter',
        meta:{
            name:'Router路由'
        },
        component:()=>import('@/views/useRouter.vue')
    },
    {
        path:'/useAxios',
        meta:{
            name:'Axios'
        },
        component:()=>import('@/views/useAxios.vue')
    },
    {
        path:'/routerLazyLoad',
        meta:{
            name:'路由懒加载'
        },
        component:import('@/views/routerLazyLoad.vue')
    }
]
const router =createRouter({
    history:createWebHistory(),
    routes
})
export default router;