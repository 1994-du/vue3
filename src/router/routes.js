// 路由分组
export default[
    {
        path:'/',
        meta:{
            name:'首页',
            level:0
        },
        component:()=>import('@/Home.vue'),
        children:[
            {
                path:'/home',
                component:()=>import('@/views/HomePage.vue')
            },
            {
                path:'/echart',
                component:()=>import('@/views/Echarts.vue')
            },
            {
                path:'/vuex',
                meta:{
                    name:'Vuex',
                    groupName:'vue3'
                },
                component:()=>import('@/views/vue/vuex.vue')
            },
            {
                path:'/vue-router',
                meta:{
                    name:'VueRouter',
                    groupName:'vue3'
                },
                component:()=>import('@/views/vue/router.vue')
            },
            {
                path:'/npm',
                meta:{
                    name:'npm命令行',
                    groupName:'npm'
                },
                component:()=>import('@/views/npm.vue')
            },
            {
                path:'/animation',
                meta:{
                    name:'动画'
                },
                component:()=>import('@/views/animation.vue')
            },
            {
                path:'/busEvent',
                meta:{
                    name:'$Bus',
                    groupName:'vue3'
                },
                component:()=>import('@/views/vue/busEvent.vue')
            },



            {
                path:'/useStore',
                meta:{
                    name:'Store',
                    groupName:'vue3'
                },
                component:()=>import('@/views/useStore.vue')
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
                    name:"HTTP版本",
                    groupName:'http'
                },
                component:()=>import('@/views/HttpVersion.vue')
            },
            {
                path:"/httpHand",
                meta:{
                    name:"HTTP握手",
                    groupName:'http'
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
                    name:'使用props',
                    groupName:'vue3'
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
                component:()=>import('@/views/fileUpload.vue')
            },
            {
                path:'/watch',
                meta:{
                    name:'watch监听',
                    groupName:'vue3'
                },
                component:()=>import('@/views/watch.vue')
            },
            {
                path:'/websocket',
                meta:{
                    name:'即时通讯'
                },
                component:()=>import('@/views/websocket.vue')
            },
            {
                path:'/promise',
                meta:{
                    name:'Promise'
                },
                component:()=>import('@/views/promise.vue')
            },
            
            {
                path:'/element-tree',
                meta:{
                    name:'element-tree'
                },
                component:()=>import('@/views/el-tree.vue')
            },
            {
                path:'/mysql',
                meta:{
                    name:'Mysql'
                },
                component:()=>import('@/views/mysql.vue')
            }
        ]
    },
    {
        path:'/login',
        meta:{
            name:'登录',
            level:0
        },
        component:()=>import('@/Login.vue')
    }
]