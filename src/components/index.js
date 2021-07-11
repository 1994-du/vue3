/*
 * @Description: 全局组件封装
 * @Version: 2.0
 * @Autor: dxx
 * @Date: 2021-06-28 21:29:36
 * @LastEditors: dxx
 * @LastEditTime: 2021-06-28 21:33:44
 */
const context = require.context('./',true,/\.vue$/);
console.log(context)
const install = function(Vue){
    context.keys().forEach((key)=>{
        Vue.component(context(key).default.name,context(key).default)
    })
}
export default install