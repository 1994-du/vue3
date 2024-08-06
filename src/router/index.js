import { createWebHistory,createWebHashHistory, createRouter } from "vue-router";
import routes from './routes'
const router =createRouter({
    history:createWebHistory(),
    routes
})
router.onError=(err)=>{
    console.log('路由错误',err)
}
export default router;