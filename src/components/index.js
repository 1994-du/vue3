/*
 * @Description: 
 * @Version: 2.0
 * @Autor: dxx
 * @Date: 2021-07-11 18:14:14
 * @LastEditors: dxx
 * @LastEditTime: 2021-07-11 18:18:17
 */
const context = require.context('./',true,/\.vue$/)
const install = function (Vue) {
    context.keys().forEach((key)=>{
        Vue.component(
            context(key).default.name,
            context.default
        )
    })
}
export default install