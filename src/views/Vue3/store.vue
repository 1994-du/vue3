<template>
    <div class="use_store">
        <h4>使用VueX</h4>
        <div class="data_view">
            <span>姓名：{{ name }}</span>
            <span>年龄：{{ age }}</span>
            <span>getters.info：{{ info }}</span>
            <el-button @click="changAge(3)">同步修改年龄（+3）</el-button>
            <el-button @click="asyncChangAge(3)">异步修改年龄（+3）</el-button>
        </div>
        <code>
            <pre>// store/index.js
import {createStore} from 'vuex';
export default createStore({
    //全局变量
    state:{
        name:'张三',
        age:0
    },
    //同步操作
    mutations:{
        CHANGE_AGE(state,arg){
            state.age+=arg.num
        }
    },
    //异步操作
    actions:{
        ASYNC_CHANGE_AGE({commit},arg){
            commit('CHANGE_AGE',arg)
        }
    },
    // 计算属性
    getters:{
        info:(state)=>`姓名：${state.name},年龄：${state.age}`
    }
})</pre>
        </code>
        <code>
            <pre>// main.js
import { createApp } from 'vue'
import store from "@/store"
const app = createApp(App)
app.use(store)
app.mount('#app')
</pre>
        </code>
        <code>
            <pre>// 组件中使用
import { reactive, toRefs } from 'vue';
import { useStore } from 'vuex'
const store = useStore()
const { name,age } = toRefs(store.state)
const reactiveGetters = reactive(store.getters)
const { info } = toRefs(reactiveGetters)</pre>
        </code>
        <h4>使用Pinia</h4>
        <div class="data_view">
            <span>姓名：{{ piniaName }}</span>
            <span>年龄：{{ piniaAge }}</span>
            <el-button @click="incrementAge">修改年龄+</el-button>
            <el-button @click="decrementAge">修改年龄-</el-button>
        </div>
        <code>
            <pre>// store/userInfo.js
import { defineStore } from 'pinia'
const useUserInfoStore = defineStore('userInfo',{
    state:()=>{
        return {
            userInfo:{
                name:'',
                age:0
            }
        }
    },
    getters:{
        doubleCount:(state)=>{
            return state.age*2
        }
    },
    actions:{
        increment(){
            this.userInfo.age++
        },
        decrement(){
            this.userInfo.age--
        }
    }
})
export default useUserInfoStore
            </pre>
        </code>
        <code>
            <pre>// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.mount('#app')</pre>
        </code>
        <code>
            <pre>// 组件中使用
import useCounterStore from '@/store/pinia/userInfo'
import { storeToRefs } from 'pinia'
const counter = useCounterStore()
// const { userInfo } = storeToRefs(counter)
const { name:piniaName,age:piniaAge } = toRefs(counter.userInfo)
const incrementAge = () => {
	counter.increment()
}
const decrementAge = () => {
	counter.decrement()
}
            </pre>
        </code>
    </div>
</template>
<script setup>
import { computed, reactive, toRefs } from 'vue';
import { useStore } from 'vuex'
const store = useStore()
const { name,age } = toRefs(store.state)
const reactiveGetters = reactive(store.getters)
const { info } = toRefs(reactiveGetters)

//使用commit调用 mutation 中的方法同步修改state中的值
const changAge = ((num)=>{
    store.commit('CHANGE_AGE',{num:num})
})
//使用dispatch调用 actions 中的方法异步修改state中的值
const asyncChangAge =((num)=>{
    store.dispatch('ASYNC_CHANGE_AGE',{num:num})
})

import useCounterStore from '@/store/pinia/userInfo'
import { storeToRefs } from 'pinia'
const counter = useCounterStore()
// const { userInfo } = storeToRefs(counter)
const { name:piniaName,age:piniaAge } = toRefs(counter.userInfo)
const incrementAge = () => {
	counter.increment()
}
const decrementAge = () => {
	counter.decrement()
}



</script>
<style scoped lang="scss">
.use_store{
    display: flex;
    flex-direction: column;
    .data_view{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: .5rem;
        span{
            margin: 0 5px;
        }
    }
}
</style>