<template>
  <el-config-provider :locale="locale">
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
  </el-config-provider>
</template>

<script>
// import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
export default {
  name: 'App',
  data(){
    return{
      locale:en
    }
  },
  computed: {
      //菜单列表
      menus() {
          console.log(this.$router.options.routes)
          return this.$router.options.routes
      }
  },
  methods: {
      toPage(menu) {
          this.$router.push(menu.path)
      },
  }
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
  }
}
.el-menu{
  height: 100%;
}
</style>
