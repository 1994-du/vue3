<!--  -->
<template>
    <p>vue3指令钩子函数<br/>
        <var>created:元素初始化的时候</var><br/>
        <var>beforeMound:指令绑定到元素后调用，只调用一次</var>、<br/>
        <var>Mound:元素插入父级DOM调用</var>、<br/>
        <var>beforeUpdate:元素被更新之前调用</var>、<br/>
        <var>updated:在包含组件的VNode及其子组件的VNode更新后调用</var>、<br/>
        <var>beforeUnmount:元素被移除前调用</var>、<br/>
        <var>unmounted:指令被移除后调用，只调用一次</var>、<br/>
    </p>
    <p>局部自定义指令</p>
    <div class="codeview">
        <img src="static/image/directive.png" alt="">
        <img src="static/image/directive-use.png" alt="">
        <div style="width:50px;height:50px" v-move></div>
    </div>
    <p>全局自定义指令</p>
    <div class="codeview">
        <img src="static/image/globalDirective.png" alt="">
        <img src="static/image/globalDirective-module.png" alt="">
        <input type="text" v-focus v-show="isShow">
    </div>
</template>

<script setup>
import {ref} from 'vue'
const isShow=ref(true)
const vMove={
    create(){},
    beforeMount() {},
    mounted(el) {
        el.style.background='red'
    },
    beforeUpdate() {},
    updated() {},
    beforeUnmount() {},
    unmounted() {},
}
</script>
<style lang="less" scoped>
p{
    text-align: left;
}
img{
    width: 200px;
    transition: all 2s;
    &:hover{
        width: 400px;
    }
}
.codeview{
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    img{
        margin-right:10px;
    }
}
</style>