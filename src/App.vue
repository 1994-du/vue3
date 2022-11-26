
<template>
      <header v-if="islogin!==0">
        <span @click="outlogin">登出</span>
        <!-- <button @click="outlogin">登出</button> -->
      </header>
      <div class="layout">
        <div class="layout_menu" v-if="islogin!==0">
          <template 
          v-for="(menuitem,index) in menus" 
          :key="menuitem.meta.name+index">
            <p v-if="menuitem.path!=='/login'" @click="toPage(menuitem)">
            {{menuitem.meta.name}}
            </p>
          </template>
        </div>
        <div class="layout_content" :class="islogin==0?'login_active':''">
            <router-view></router-view>
        </div>
      </div>
</template>


<script setup>
import LoginPageVue from './views/LoginPage.vue';
import {useRouter} from 'vue-router'
import {ref} from 'vue'
import {useStore} from 'vuex'
const { computed, onMounted, onBeforeMount, onUpdated, onUnmounted, onBeforeUnmount }=require("@vue/runtime-core")
const store = useStore()
const islogin = computed(()=>{
  const sessionLogin = JSON.parse(sessionStorage.getItem('islogin'))
  return sessionLogin?sessionLogin:store.state.islogin
})
const router=useRouter()
const menus = computed(()=>{
  return router.getRoutes()
})
const toPage=function(menu) {
    router.push(menu.path)
}
const outlogin=function(){
    store.commit('changLogin',{val:0})
    router.go(0)
}
const setSessionStorage = function(){
  sessionStorage.setItem('islogin',JSON.stringify(store.state.islogin))
}
onBeforeMount(()=>{
  window.addEventListener('beforeunload',setSessionStorage)
  store.commit('changLogin',{val:islogin.value})
})
onMounted(()=>{
  if(islogin.value==0){
    router.push({
      path:'/login'
    })
  }
})
onUpdated(()=>{})
onBeforeUnmount(()=>{
  window.removeEventListener('beforeunload',setSessionStorage)
})
onUnmounted(()=>{
  console.log(islogin.value)
})
</script>

<style lang="less">
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  header{
    height: 50px;
    background: #2c3e50;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: white;
    span{
      margin: 0 10px;
      cursor: pointer;
    }
  }
  .layout {
    height: 100%;
    flex: 1;
    display: flex;
    &_menu {
        font-size: 14px;
        font-weight: bold;
        width: 150px;
        flex-shrink: 0;
        border: 1px solid #eee;
        overflow: auto;
        &::-webkit-scrollbar{
          display: none;
        }
        p{
          height: 40px;
          text-align: center;
          cursor: pointer;
          line-height: 40px;
          border-bottom: 1px solid #eee;
        }
    }
    &_content{
        flex: 1;
        padding: 15px;
        overflow: auto;
    }
    .login_active{
      background: #2c3e50;
    }
  }
}
</style>
