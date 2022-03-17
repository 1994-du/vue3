import Vue from 'vue'
import Router from "vue-router";
Vue.use(Router)
// 首页
import HomePage from "../views/HomePage.vue";
// 命令行
import CommandLine from '../views/CommandLine';
//Sreadjs
import SpreadJs from "../views/SpreadJs.vue";
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
            },
            {
                path:'/spreadjs',
                meta:{
                    name:'SpreadJs'
                },
                component:SpreadJs
            }
        ]
    }
]
const router = new Router({
    routes
})

export default router;