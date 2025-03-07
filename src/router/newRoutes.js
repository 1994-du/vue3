export default [
    {
        path: 'Animation/animation',
        name: 'animation',
        meta: {"groupName":"Animation"},
        component: () => import('@/views/Animation/animation.vue')
    },
    {
        path: 'Animation/carousel',
        name: 'carousel',
        meta: {"groupName":"Animation"},
        component: () => import('@/views/Animation/carousel.vue')
    },
    {
        path: 'Axios/useAxios',
        name: 'useAxios',
        meta: {"groupName":"Axios"},
        component: () => import('@/views/Axios/useAxios.vue')
    },
    {
        path: 'Canvas/Audiovisualization',
        name: 'Audiovisualization',
        meta: {"groupName":"Canvas"},
        component: () => import('@/views/Canvas/Audiovisualization.vue')
    },
    {
        path: 'Canvas/snowflake',
        name: 'snowflake',
        meta: {"groupName":"Canvas"},
        component: () => import('@/views/Canvas/snowflake.vue')
    },
    {
        path: 'Echarts/echart-bar',
        name: 'echart-bar',
        meta: {"groupName":"Echarts"},
        component: () => import('@/views/Echarts/echart-bar.vue')
    },
    {
        path: 'Echarts/echart-bars',
        name: 'echart-bars',
        meta: {"groupName":"Echarts"},
        component: () => import('@/views/Echarts/echart-bars.vue')
    },
    {
        path: 'Echarts/echart-bullet',
        name: 'echart-bullet',
        meta: {"groupName":"Echarts"},
        component: () => import('@/views/Echarts/echart-bullet.vue')
    },
    {
        path: 'Echarts/echart-lineBar',
        name: 'echart-lineBar',
        meta: {"groupName":"Echarts"},
        component: () => import('@/views/Echarts/echart-lineBar.vue')
    },
    {
        path: 'Echarts/echart-scatterBars',
        name: 'echart-scatterBars',
        meta: {"groupName":"Echarts"},
        component: () => import('@/views/Echarts/echart-scatterBars.vue')
    },
    {
        path: 'ElementPlus/el-popover',
        name: 'el-popover',
        meta: {"groupName":"ElementPlus"},
        component: () => import('@/views/ElementPlus/el-popover.vue')
    },
    {
        path: 'ElementPlus/el-upload',
        name: 'el-upload',
        meta: {"groupName":"ElementPlus"},
        component: () => import('@/views/ElementPlus/el-upload.vue')
    },
    {
        path: 'Git/index',
        name: 'index',
        meta: {"groupName":"Git"},
        component: () => import('@/views/Git/index.vue')
    },
    {
        path: 'HomePage',
        name: 'HomePage',
        meta: {"groupName":"views"},
        component: () => import('@/views/HomePage.vue')
    },
    {
        path: 'Http/HttpVersion',
        name: 'HttpVersion',
        meta: {"groupName":"Http"},
        component: () => import('@/views/Http/HttpVersion.vue')
    },
    {
        path: 'Http/StateCode',
        name: 'StateCode',
        meta: {"groupName":"Http"},
        component: () => import('@/views/Http/StateCode.vue')
    },
    {
        path: 'Http/httpHand',
        name: 'httpHand',
        meta: {"groupName":"Http"},
        component: () => import('@/views/Http/httpHand.vue')
    },
    {
        path: 'IndexedDB/base',
        name: 'base',
        meta: {"groupName":"IndexedDB"},
        component: () => import('@/views/IndexedDB/base.vue')
    },
    {
        path: 'IndexedDB/transaction',
        name: 'transaction',
        meta: {"groupName":"IndexedDB"},
        component: () => import('@/views/IndexedDB/transaction.vue')
    },
    {
        path: 'Js/Generator',
        name: 'Generator',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/Generator.vue')
    },
    {
        path: 'Js/PublishSubscribePattern',
        name: 'PublishSubscribePattern',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/PublishSubscribePattern.vue')
    },
    {
        path: 'Js/arrayFilter',
        name: 'arrayFilter',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/arrayFilter.vue')
    },
    {
        path: 'Js/arrayToTree',
        name: 'arrayToTree',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/arrayToTree.vue')
    },
    {
        path: 'Js/asyncAwait',
        name: 'asyncAwait',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/asyncAwait.vue')
    },
    {
        path: 'Js/closure',
        name: 'closure',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/closure.vue')
    },
    {
        path: 'Js/currying',
        name: 'currying',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/currying.vue')
    },
    {
        path: 'Js/customNew',
        name: 'customNew',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/customNew.vue')
    },
    {
        path: 'Js/dataTypeJudge',
        name: 'dataTypeJudge',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/dataTypeJudge.vue')
    },
    {
        path: 'Js/debounceThrottling',
        name: 'debounceThrottling',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/debounceThrottling.vue')
    },
    {
        path: 'Js/deepCopy',
        name: 'deepCopy',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/deepCopy.vue')
    },
    {
        path: 'Js/eventLoop',
        name: 'eventLoop',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/eventLoop.vue')
    },
    {
        path: 'Js/isEmptyObject',
        name: 'isEmptyObject',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/isEmptyObject.vue')
    },
    {
        path: 'Js/prototype',
        name: 'prototype',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/prototype.vue')
    },
    {
        path: 'Js/setInterval',
        name: 'setInterval',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/setInterval.vue')
    },
    {
        path: 'Js/this',
        name: 'this',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/this.vue')
    },
    {
        path: 'Js/xhrTime',
        name: 'xhrTime',
        meta: {"groupName":"Js"},
        component: () => import('@/views/Js/xhrTime.vue')
    },
    {
        path: 'LoginPage',
        name: 'LoginPage',
        meta: {"groupName":"views"},
        component: () => import('@/views/LoginPage.vue')
    },
    {
        path: 'Network/TCP',
        name: 'TCP',
        meta: {"groupName":"Network"},
        component: () => import('@/views/Network/TCP.vue')
    },
    {
        path: 'Promise/promise',
        name: 'promise',
        meta: {"groupName":"Promise"},
        component: () => import('@/views/Promise/promise.vue')
    },
    {
        path: 'SetPage',
        name: 'SetPage',
        meta: {"groupName":"views"},
        component: () => import('@/views/SetPage.vue')
    },
    {
        path: 'Vue3/ComponentCommunication',
        name: 'ComponentCommunication',
        meta: {"groupName":"Vue3"},
        component: () => import('@/views/Vue3/ComponentCommunication.vue')
    },
    {
        path: 'Vue3/busEvent',
        name: 'busEvent',
        meta: {"groupName":"Vue3"},
        component: () => import('@/views/Vue3/busEvent.vue')
    },
    {
        path: 'Vue3/communication/provideInject',
        name: 'provideInject',
        meta: {"groupName":"communication"},
        component: () => import('@/views/Vue3/communication/provideInject.vue')
    },
    {
        path: 'Vue3/customerDirective',
        name: 'customerDirective',
        meta: {"groupName":"Vue3"},
        component: () => import('@/views/Vue3/customerDirective.vue')
    },
    {
        path: 'Vue3/importComponent',
        name: 'importComponent',
        meta: {"groupName":"Vue3"},
        component: () => import('@/views/Vue3/importComponent.vue')
    },
    {
        path: 'Vue3/propsUse',
        name: 'propsUse',
        meta: {"groupName":"Vue3"},
        component: () => import('@/views/Vue3/propsUse.vue')
    },
    {
        path: 'Vue3/router/router',
        name: 'router',
        meta: {"groupName":"router"},
        component: () => import('@/views/Vue3/router/router.vue')
    },
    {
        path: 'Vue3/router/routerLazyLoad',
        name: 'routerLazyLoad',
        meta: {"groupName":"router"},
        component: () => import('@/views/Vue3/router/routerLazyLoad.vue')
    },
    {
        path: 'Vue3/router/routerPrinciple',
        name: 'routerPrinciple',
        meta: {"groupName":"router"},
        component: () => import('@/views/Vue3/router/routerPrinciple.vue')
    },
    {
        path: 'Vue3/vuex',
        name: 'vuex',
        meta: {"groupName":"Vue3"},
        component: () => import('@/views/Vue3/vuex.vue')
    },
    {
        path: 'Vue3/watch',
        name: 'watch',
        meta: {"groupName":"Vue3"},
        component: () => import('@/views/Vue3/watch.vue')
    },
    {
        path: 'cacheDetail',
        name: 'cacheDetail',
        meta: {"groupName":"views"},
        component: () => import('@/views/cacheDetail.vue')
    },
    {
        path: 'divCenter',
        name: 'divCenter',
        meta: {"groupName":"views"},
        component: () => import('@/views/divCenter.vue')
    },
    {
        path: 'domCssRender',
        name: 'domCssRender',
        meta: {"groupName":"views"},
        component: () => import('@/views/domCssRender.vue')
    },
    {
        path: 'elementShow',
        name: 'elementShow',
        meta: {"groupName":"views"},
        component: () => import('@/views/elementShow.vue')
    },
    {
        path: 'fileUpload',
        name: 'fileUpload',
        meta: {"groupName":"views"},
        component: () => import('@/views/fileUpload.vue')
    },
    {
        path: 'mysql',
        name: 'mysql',
        meta: {"groupName":"views"},
        component: () => import('@/views/mysql.vue')
    },
    {
        path: 'npm',
        name: 'npm',
        meta: {"groupName":"views"},
        component: () => import('@/views/npm.vue')
    },
    {
        path: 'nvmUse',
        name: 'nvmUse',
        meta: {"groupName":"views"},
        component: () => import('@/views/nvmUse.vue')
    },
    {
        path: 'ref',
        name: 'ref',
        meta: {"groupName":"views"},
        component: () => import('@/views/ref.vue')
    },
    {
        path: 'twoWayBinding',
        name: 'twoWayBinding',
        meta: {"groupName":"views"},
        component: () => import('@/views/twoWayBinding.vue')
    },
    {
        path: 'websocket',
        name: 'websocket',
        meta: {"groupName":"views"},
        component: () => import('@/views/websocket.vue')
    }
]