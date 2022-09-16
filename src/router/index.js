import { createWebHistory, createRouter } from "vue-router";
// 首页
import HomePage from "@/views/HomePage.vue";
// 命令行
import CommandLine from '@/views/CommandLine.vue';
// keyframes(关键帧)
import KeyFrames from "@/views/keyframes.vue";
// 浏览器内核
import BrowserCore from "@/views/browserCore.vue"
const routes=[
    {
        path:'/',
        meta:{
            name:'首页'
        },
        component:HomePage
    },
    {
        path:'/commandline',
        meta:{
            name:'命令行'
        },
        component:CommandLine
    },
    {
        path:'/keyframes',
        meta:{
            name:'关键帧'
        },
        component:KeyFrames
    },
    {
        path:'/browsercore',
        meta:{
            name:'浏览器内核'
        },
        component:BrowserCore
    }
]
const router =createRouter({
    history:createWebHistory(),
    routes
})
export default router;