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
        <highlightjs code="
import {createStore} from 'vuex';
export default createStore({
    //全局变量
    state:{
        islogin:0,
        name:'dxx',
        age:28
    },
    //同步操作
    mutations:{
        changAge(state,arg){
            state.age+=arg.num
        }
    },
    //异步操作
    actions:{
        asyncChangeAge(context,arg){
            return new Promise(()=>{
                setTimeout(()=>{
                    context.commit('changAge',{num:arg.num})
                },1000)
            })
        }
    },
    // 计算属性
    getters:{
        info:(state)=>state.age+state.name,
        moreinfo:(state,gettets)=>state.age+state.name+gettets.info,
        setName:(state=>((p)=>state.name+p))
    }
})
        "></highlightjs>
        <p>2.main.js</p>
        <highlightjs code="
import store from './store'
const app = createApp(App);
app.use(store)
app.mount('#app')
        "></highlightjs>
        <h2>二、使用store</h2>
<highlightjs code="
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
"></highlightjs>
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