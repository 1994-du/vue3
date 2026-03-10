import { createWebHistory,createWebHashHistory, createRouter } from "vue-router";
import routes from './routes'
const router =createRouter({
    history:createWebHistory(import.meta.env.VITE_PROJECT_URL),
    routes
})
router.onError=(err)=>{
    console.log('路由错误',err)
}

// router.beforeEach((to,from,next)=>{
//     let username = localStorage.getItem('username')
//     if(!username && to.path !== '/login'){
//         next({path:'/login'})
//     }else{
//         next()
//     }
// })
export default router;