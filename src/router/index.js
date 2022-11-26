import { createWebHistory, createRouter } from "vue-router";
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
        path:'/login',
        name:'login',
        meta:{
            name:'登录'
        },
        component:()=>import('@/views/LoginPage.vue')
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
        component:()=>import('@/views/routerLazyLoad.vue')
    },
    {
        path:"/imgSavePath",
        meta:{
            name:"图片保存路径"
        },
        component:()=>import('@/views/imgSavePath.vue')
    },
    {
        path:"/httpVersion",
        meta:{
            name:"HTTP版本"
        },
        component:()=>import('@/views/HttpVersion.vue')
    },
    {
        path:"/customerDirective",
        meta:{
            name:"自定义指令"
        },
        component:()=>import('@/views/customerDirective.vue')
    }
]
const router =createRouter({
    history:createWebHistory(),
    routes
})

// const islogin =sessionStorage.getItem('islogin')
// router.beforeEach((to,from,next)=>{
//     if(to.path == '/login'){ next()}else{
//         if(islogin=='0'){
//             next({path:'/login'})
//         }else{
//             next()
//         }
//     }
    
// })
export default router;