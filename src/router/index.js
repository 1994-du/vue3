import {createRouter,createWebHistory} from 'vue-router'
import G6 from './../views/G6.vue';
const routerHistory = createWebHistory()
const router = createRouter({
    history:routerHistory,
    routes:[
        {
            path:'/',
            
            // component:resolve=>require(['../views/G6.vue'],resolve)
            component:G6
        }
    ]
})
export default router;