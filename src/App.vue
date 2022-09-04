<template>
  <div class="layout">
      <div class="layout_menu">
          <a-menu mode="inline">
              <a-menu-item v-for="menuitem in menus" :key="menuitem" @click="toPage(menuitem)">{{menuitem.meta.name}}</a-menu-item>
          </a-menu>
      </div>
      <div class="layout_content">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>

export default {
  name: 'App',
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
.ant-menu-item-selected{
  color: black !important;
}
.ant-menu-item::after{
  border-right:3px solid black!important;
}
.ant-menu-submenu-title:hover{
  color: black !important;
}
.ant-menu-item:hover{
  color: black !important;
}
.ant-menu-title-content{
  font-family:Arial, Helvetica, sans-serif;
  font-weight: bold!important;
}
</style>
