<template>
  <div class="set_page">
    <h4 @click="router.back()">设置</h4>
    <el-tabs
      v-model="activeName"
      @tab-change="tabChange">
      <el-tab-pane label="用户设置" name="userManagement"></el-tab-pane>
      <el-tab-pane label="角色设置" name="roleManagement"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// tab切换
const activeName = ref('userManagement');
const tabChange = (tab) => {
    router.replace('/set/'+tab)
}
</script>
<style lang='scss' scoped>
@use '@/styles/setPage.scss';
</style>