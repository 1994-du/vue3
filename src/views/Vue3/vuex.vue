<template>
    <div class="use_store">
        <div class="store_box">
            <span>姓名：{{store.state.name}}</span>
            <span>年龄：{{store.state.age}}</span>
            <el-button @click="changAge(3)">同步修改年龄（+3）</el-button>
            <el-button @click="asyncChangAge(3)">异步修改年龄（+3）</el-button>
        </div>
        <h2>一、创建store文件</h2>
        <p>1.store/index.js</p>
        <img src="/img/store.png" alt="" style="width:200px;">
        <p>2.main.js</p>
        <img src="/img/store_main.png" alt="" style="width:200px;">
        <h2>二、使用store</h2>
        <img src="/img/store_use.png" alt="" style="width:200px;">
    </div>
</template>
<script setup>
import { onBeforeMount } from 'vue';
import {useStore} from 'vuex'
const store = useStore()
//使用commit调用 mutation 中的方法同步修改state中的值
const changAge = ((num)=>{
    store.commit('CHANGE_AGE',{num:num})
})
//使用dispatch调用 actions 中的方法异步修改state中的值
const asyncChangAge =((num)=>{
    store.dispatch('ASYNC_CHANGE_AGE',{num:num})
})
onBeforeMount(() => {
    console.log(store)
    console.log(store.state)
    console.log(store.getters.info)
    console.log(store.getters.moreinfo)
    console.log(store.getters.setName('sss'))
})
</script>
<style scoped lang="scss">
h2,p{
    text-align: left;
}
img {
    width: 100px;
    transition: all 2s;
}
img:hover {
    transform: scale(1.5) translateX(50px);
}
.use_store{
    display: flex;
    flex-direction: column;
    .store_box{
        display: flex;
        justify-content: space-around;
    }
}
</style>