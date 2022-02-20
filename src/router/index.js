import {createRouter, createWebHashHistory}from "vue-router";
// 首页
import HomePage from "../views/HomePage.vue";
// 命令行
import CommandLine from '../views/CommandLine';
const routes=[
    {
        path:'/',
        component:HomePage,
        children:[
            {
                path:'/commandline',
                meta:{
                    name:'命令行'
                },
                component:CommandLine
            }
        ]
    }
]
const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router;