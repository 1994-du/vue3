<!--  -->
<template>
<div class="customer_directive">
    <input type="text" v-focus v-show="isShow" v-move style="width: 100px;height: 20px;border: none;border-radius: 3px;text-indent: 10px;">
<h1>自定义指令</h1>
<h4>vue3指令生命周期函数</h4>
<highlightjs code="created:元素初始化的时候
beforeMound:指令绑定到元素后调用，只调用一次
created:元素初始化的时候
beforeMound:指令绑定到元素后调用，只调用一次
Mound:元素插入父级DOM调用
beforeUpdate:元素被更新之前调用
updated:在包含组件的VNode及其子组件的VNode更新后调用
beforeUnmount:元素被移除前调用
unmounted:指令被移除后调用，只调用一次">
</highlightjs>
<h4>局部自定义指令</h4>
<highlightjs code="指令命名规则：小写v开头
const vMove={
    create(){},
    beforeMount(){},
    mounted(el){
        el.style.background='red'
    },
    beforeUpdate(){},
    updated(){},
    beforeUnmount(){},
    unmounted(){}
}
<div style='width:50px;height:50px' v-move></div>">
</highlightjs>
<h4>全局自定义指令</h4>
<highlightjs code="import { createApp } from 'vue';
import App from './App.vue';
const app=createApp(App);
app.directive('focue',{
    mounted(el){
        el.focus()
    }
})
//多个指令可以封装单独js文件
import directive from ./directives.js
directives(app)

./directives.js
const directive=(app)=>{
    app.directive('focus',{
        mounted(el) {
            el.focus()
        }
    })
}
export default directive"></highlightjs>
</div>
    
</template>

<script setup>
import {ref} from 'vue'
const isShow=ref(true)
const vMove={
    create(){},
    beforeMount() {},
    mounted(el) {
        el.style.background='var(--fontColor)';
        el.style.color='var(--inputColor)'
    },
    beforeUpdate() {},
    updated() {},
    beforeUnmount() {},
    unmounted() {},
}
</script>
<style lang="less" scoped>
.customer_directive{
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>