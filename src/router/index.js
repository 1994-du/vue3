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
    // {
    //     path:'/login',
    //     name:'login',
    //     meta:{
    //         name:'登录'
    //     },
    //     component:()=>import('@/views/LoginPage.vue')
    // },
    {
        path:'/useNpm',
        meta:{
            name:'npm命令行'
        },
        component:()=>import('@/views/useNpm.vue')
    },
    {
        path:'/animation',
        meta:{
            name:'动画'
        },
        component:()=>import('@/views/animation.vue')
    },
    // {
    //     path:'/browsercore',
    //     meta:{
    //         name:'浏览器内核'
    //     },
    //     component:()=>import('@/views/browserCore.vue')
    // },
    {
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
        path:"/httpVersion",
        meta:{
            name:"HTTP版本"
        },
        component:()=>import('@/views/HttpVersion.vue')
    },
    {
        path:"/httpHand",
        meta:{
            name:"HTTP握手"
        },
        component:()=>import('@/views/httpHand.vue')
    },
    {
        path:"/customerDirective",
        meta:{
            name:"自定义指令"
        },
        component:()=>import('@/views/customerDirective.vue')
    },
    {
        path:"/cacheDetail",
        meta:{
            name:"浏览器缓存"
        },
        component:()=>import('@/views/cacheDetail.vue')
    },
    {
        path:"/debounceThrottling",
        meta:{
            name:"防抖节流"
        },
        component:()=>import('@/views/debounceThrottling.vue')
    },
    {
        path:"/twoWayBinding",
        meta:{
            name:"双向绑定原理"
        },
        component:()=>import('@/views/twoWayBinding.vue')
    },
    {
        path:"/copyType",
        meta:{
            name:"深浅拷贝"
        },
        component:()=>import('@/views/copyType.vue')
    },
    {
        path:"/dataTypeJudge",
        meta:{
            name:"数据类型判断"
        },
        component:()=>import('@/views/dataTypeJudge.vue')
    },
    {
        path:"/stateCode",
        meta:{
            name:"请求状态码"
        },
        component:()=>import('@/views/StateCode.vue')
    },
    {
        path:'/elementShow',
        meta:{
            name:'display、visibility、opacity的区别'
        },
        component:()=>import('@/views/elementShow.vue')
    },
    {
        path:'/domCssRender',
        meta:{
            name:'dom树、css树、render树的区别'
        },
        component:()=>import('@/views/domCssRender.vue')
    },
    {
        path:'/prototypeProto',
        meta:{
            name:'原型和原型链'
        },
        component:()=>import('@/views/prototype.vue')
    },
    {
        path:'/useNvm',
        meta:{
            name:'nvm的使用'
        },
        component:()=>import('@/views/nvmUse.vue')
    },
    {
        path:'/componentImp',
        meta:{
            name:'组件引入'
        },
        component:()=>import('@/views/importComponent.vue')
    },
    {
        path:'/useProps',
        meta:{
            name:'使用props'
        },
        component:()=>import('@/views/propsUse.vue')
    },
    {
        path:'/refReactiveTorefs',
        meta:{
            name:'ref、reactive、toRefs'
        },
        component:()=>import('@/views/refReactiveTorefs.vue')
    },
    {
        path:'/horizontallyAndVerticallyCentered',
        meta:{
            name:'div水平垂直居中'
        },
        component:()=>import('@/views/horizontallyAndVerticallyCentered.vue')
    },
    {
        path:'/fileUpload',
        meta:{
            name:'打开文件管理器'
        },
        component:()=>import('@/views/file/fileUpload.vue')
    },
    {
        path:'/watch',
        meta:{
            name:'watch监听'
        },
        component:()=>import('@/views/vue3/watch.vue')
    }
]
const router =createRouter({
    history:createWebHistory(),
    routes
})
router.onError=(w)=>{
    console.log(w)
}
// router.beforeEach((to,from,next)=>{
//     const islogin =sessionStorage.getItem('islogin')
//     if(to.path == '/login')return next()
//     if(islogin=='0')return next('/login')
//     next()
// })
export default router;