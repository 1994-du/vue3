<template>
    <div class="layout">
        <div class="layout_menu">
            <el-menu>
              <el-menu-item v-for="(menuitem,index) in menus" :key="menuitem.meta.name+index" :index="index.toString()" @click="toPage(menuitem)">{{menuitem.meta.name}}</el-menu-item>
            </el-menu>
        </div>
        <div class="layout_content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
const { computed }=require("@vue/runtime-core")
const router=useRouter()
const menus = computed(()=>{
  return router.getRoutes()
})
const toPage=function(menu) {
    router.push(menu.path)
}

</script>

<style lang="less">
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .layout{
    
    height: 100%;
    .layout_menu{
      width: 150px;
    }
  }
}
.el-menu{
  height: 100%;
  .el-menu-item{
    width: 100%;
    text-align: center;
  }
}
</style>
