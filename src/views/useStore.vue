<template>
    <div class="use_store">
        <div class="store_box">
            <p>姓名：{{store.state.name}}</p>
            <p>年龄：{{store.state.age}}</p>
            <button @click="changAge(3)">修改年龄+3</button>
            <button @click="asyncChangAge(3)">异步调用actions修改年龄</button>
        </div>
        <h2>一、创建store文件</h2>
        <p>1.store/index.js</p>
        <img src="static/image/useStore.png" alt="">
        <p>2.main.js</p>
        <img src="static/image/useStore-main.png" alt="">
        <h2>二、使用store</h2>
        <img src="static/image/useStore-use.png" alt="">
    </div>
</template>
<script setup>
import { onBeforeMount } from 'vue';
import {useStore} from 'vuex'
const store = useStore()
//使用commit调用 mutation 中的方法同步修改state中的值
const changAge = ((num)=>{
    store.commit('changAge',{num:num})
    // or
    // store.commit({
    //     type:'changAge',
    //     num:4
    // })
})
//使用dispatch调用 actions 中的方法异步修改state中的值
const asyncChangAge =((num)=>{
    store.dispatch('asyncChangeAge',{num:num})
    // or
    // store.dispatch({
    //     type:'asyncChangeAge',
    //     num:num
    // })
})
onBeforeMount(() => {
    console.log(store)
    console.log(store.state)
    console.log(store.getters.info)
    console.log(store.getters.moreinfo)
    console.log(store.getters.setName('sss'))
})
</script>
<style scoped lang="less">
h2,p{
    text-align: left;
}
img {
    width: 100px;
    transition: all 2s;
}
.use_store{
    display: flex;
    flex-direction: column;
    
}
</style>