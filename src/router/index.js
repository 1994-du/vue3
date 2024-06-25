import { createWebHistory, createRouter } from "vue-router";
import routes from './routes'
const router =createRouter({
    history:createWebHistory(),
    routes
})
router.onError=(err)=>{
    console.log('路由错误',err)
}
// router.beforeEach((to,from,next)=>{
//     const token =localStorage.getItem('token')
//     if(to.path==='/login'){
//         next()
//     }else{
//         if(token){
//             next()
//         }else{
//             next('/login')
//         }
//     }
// })
export default router;