import { createWebHistory, createRouter } from "vue-router";
// 首页
import HomePage from "@/views/HomePage.vue";
// 命令行
import CommandLine from './../views/childviews/CommandLine.vue';
//接口请求
import UseAxios from "@/views/childviews/useAxios.vue";

const routes=[
    {
        path:'/',
        component:HomePage,
        redirect:'/commandline',
        children:[
            {
                path:'/commandline',
                meta:{
                    name:'命令行'
                },
                component:CommandLine
            },
            {
                path:'/useaxios',
                meta:{
                    name:'接口请求'
                },
                component:UseAxios
            }
        ]
    }
]
const router =createRouter({
    history:createWebHistory(),
    routes
})
export default router;