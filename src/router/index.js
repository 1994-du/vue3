import Vue from 'vue'
import Router from "vue-router";
Vue.use(Router)
// 首页
import HomePage from "@/views/HomePage.vue";
// 命令行
import CommandLine from '@/views/childviews/CommandLine.vue';
//Sreadjs
import SpreadJs from "@/views/childviews/SpreadJs.vue";
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
                path:'/spreadjs',
                meta:{
                    name:'SpreadJs'
                },
                component:SpreadJs
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
const router = new Router({
    routes
})

export default router;