// 路由分组
export default[
    {
        path:'/',
        meta:{},
        component:()=>import('@/Home.vue'),
        children:[
            // 首页
            {
                path:'/home',
                name:'Home',
                meta:{
                    groupName:'首页',
                },
                component:()=>import('@/views/HomePage.vue')
            },
            // Echarts
            {
                path:'/bar',
                name:'Echart-Bar',
                meta:{
                    groupName:'Echarts',
                },
                component:()=>import('@/views/Echarts/echart-bar.vue')
            },
            {
                path:'/bullet',
                name:'Echart-Bullet',
                meta:{
                    groupName:'Echarts',
                },
                component:()=>import('@/views/Echarts/echart-bullet.vue')
            },
            {
                path:'/lineBar',
                name:'Echart-LineBar',
                meta:{
                    groupName:'Echarts'
                },
                component:()=>import('@/views/Echarts/echart-lineBar.vue')
            },
            {
                path:'/scatterBar',
                name:'Echart-ScatterBar',
                meta:{
                    groupName:'Echarts'
                },
                component:()=>import('@/views/Echarts/echart-scatterBars.vue')
            },
            {
                path:'/bars',
                name:'Echart-bars',
                meta:{
                    groupName:'Echarts'
                },
                component:()=>import('@/views/Echarts/echart-bars.vue')
            },
            // Vue3
            {
                path:'/vuex',
                name:'Vuex',
                meta:{
                    groupName:'Vue3',
                },
                component:()=>import('@/views/Vue3/vuex.vue')
            },
            {
                path:'/vue-router',
                name:'VueRouter',
                meta:{
                    groupName:'Vue3',
                },
                component:()=>import('@/views/Vue3/router.vue')
            },
            {
                path:'/busEvent',
                name:'$Bus',
                meta:{
                    groupName:'Vue3',
                },
                component:()=>import('@/views/Vue3/busEvent.vue')
            },
            {
                path:'/ComponentCommunication',
                name:'组件通信',
                meta:{
                    groupName:'Vue3',
                },
                component:()=>import('@/views/Vue3/ComponentCommunication.vue')
            },
            {
                path:'/routerLazyLoad',
                name:'路由懒加载',
                meta:{
                    groupName:'Vue3',
                },
                component:()=>import('@/views/Vue3/routerLazyLoad.vue')
            },
            {
                path:"/directive",
                name:"自定义指令",
                meta:{
                    groupName:'Vue3',
                },
                component:()=>import('@/views/Vue3/customerDirective.vue')
            },
            {
                path:'/componentImp',
                name:'组件引入',
                meta:{
                    groupName:'Vue3',
                },
                component:()=>import('@/views/Vue3/importComponent.vue')
            },
            {
                path:'/props',
                name:'使用props',
                meta:{
                    groupName:'Vue3'
                },
                component:()=>import('@/views/Vue3/propsUse.vue')
            },
            {
                path:'/watch',
                name:'watch监听',
                meta:{
                    groupName:'Vue3'
                },
                component:()=>import('@/views/Vue3/watch.vue')
            },
            {
                path:'/ref',
                name:'ref的使用',
                meta:{
                    groupName:'Vue3'
                },
                component:()=>import('@/views/ref.vue')
            },
            // ElementPlus
            {
                path:'/popover',
                name:'Popover',
                meta:{
                    groupName:'ElementPlus'
                },
                component:()=>import('@/views/ElementPlus/el-popover.vue')
            },{
                path:'/upload',
                name:'Upload',
                meta:{
                    groupName:'ElementPlus'
                },
                component:()=>import('@/views/ElementPlus/el-upload.vue')
            },
            // Http
            {
                path:"/httpVersion",
                name:"HTTP版本",
                meta:{
                    groupName:"HTTP"
                },
                component:()=>import('@/views/Http/HttpVersion.vue')
            },
            {
                path:"/httpHand",
                name:"HTTP握手",
                meta:{
                    groupName:"HTTP"
                },
                component:()=>import('@/views/Http/httpHand.vue')
            },
            {
                path:"/stateCode",
                name:"请求状态码",
                meta:{
                    groupName:"HTTP"
                },
                component:()=>import('@/views/Http/StateCode.vue')
            },
            // Js
            {
                path:'/this',
                name:'this指向',
                meta:{
                    groupName:'Js'
                },
                component:()=>import('@/views/Js/this.vue')
            },
            {
                path:'/currying',
                name:'函数柯里化',
                meta:{
                    groupName:'Js'
                },
                component:()=>import('@/views/Js/currying.vue')
            },
            // Axios
            {
                path:'/axios',
                name:'Axios',
                meta:{
                    groupName:'Axios'
                },
                component:()=>import('@/views/Axios/useAxios.vue')
            },
            // Animation
            {
                path:'/animation',
                name:'动画',
                meta:{
                    groupName:'动画'
                },
                component:()=>import('@/views/Animation/animation.vue')
            },
            // Npm
            {
                path:'/npm',
                name:'Npm',
                meta:{
                    groupName:'Npm',
                },
                component:()=>import('@/views/npm.vue')
            },
            // Promise
            {
                path:'/promise',
                name:'Promise',
                meta:{
                    groupName:'Promise'
                },
                component:()=>import('@/views/Promise/promise.vue')
            },
            {
                path:"/cacheDetail",
                name:"浏览器缓存",
                meta:{
                    groupName:"浏览器缓存"
                },
                component:()=>import('@/views/cacheDetail.vue')
            },
            {
                path:"/debounceThrottling",
                name:"防抖节流",
                meta:{
                    groupName:"防抖节流"
                },
                component:()=>import('@/views/debounceThrottling.vue')
            },
            {
                path:"/twoWayBinding",
                name:"双向绑定原理",
                meta:{
                    groupName:"双向绑定原理"
                },
                component:()=>import('@/views/twoWayBinding.vue')
            },
            {
                path:"/copyType",
                name:"深浅拷贝",
                meta:{
                    groupName:"深浅拷贝"
                },
                component:()=>import('@/views/copyType.vue')
            },
            {
                path:"/dataTypeJudge",
                name:"数据类型判断",
                meta:{
                    groupName:"数据类型判断"
                },
                component:()=>import('@/views/dataTypeJudge.vue')
            },
            
            {
                path:'/elementShow',
                name:'display、visibility、opacity的区别',
                meta:{
                    groupName:'display、visibility、opacity的区别'
                },
                component:()=>import('@/views/elementShow.vue')
            },
            {
                path:'/domCssRender',
                name:'dom树、css树、render树的区别',
                meta:{
                    groupName:'dom树、css树、render树的区别'
                },
                component:()=>import('@/views/domCssRender.vue')
            },
            {
                path:'/prototypeProto',
                name:'原型和原型链',
                meta:{
                    groupName:'原型和原型链'
                },
                component:()=>import('@/views/prototype.vue')
            },
            {
                path:'/useNvm',
                name:'nvm的使用',
                meta:{
                    groupName:'nvm的使用'
                },
                component:()=>import('@/views/nvmUse.vue')
            },
            {
                path:'/divCenter',
                name:'div水平垂直居中',
                meta:{
                    groupName:'div水平垂直居中'
                },
                component:()=>import('@/views/divCenter.vue')
            },
            {
                path:'/fileUpload',
                name:'文件上传',
                meta:{
                    groupName:'打开文件管理器'
                },
                component:()=>import('@/views/fileUpload.vue')
            },
            
            {
                path:'/websocket',
                name:'即时通讯',
                meta:{
                    groupName:'即时通讯'
                },
                component:()=>import('@/views/websocket.vue')
            },
            {
                path:'/mysql',
                name:'Mysql',
                meta:{
                    groupName:'数据库'
                },
                component:()=>import('@/views/mysql.vue')
            },
            {
                path:'/git',
                name:'Git命令',
                meta:{
                    groupName:'Git'
                },
                component:()=>import('@/views/Git/index.vue')
            }
        ]
    }
]