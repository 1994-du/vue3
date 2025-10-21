<template>
  <div class="set_page">
    <div class="set_menu">
        <el-menu  default-active="userManagement" @select="handleSelect">
            <el-menu-item index="userManagement">用户设置</el-menu-item>
            <el-menu-item index="roleManagement">角色设置</el-menu-item>
        </el-menu>
    </div>
    <div class="set_content">
        <router-view></router-view>
    </div>
    <!-- <h4 @click="router.back()">设置</h4> -->
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// tab切换
const activeName = ref('userManagement');
// 菜单选择
const handleSelect = (tab) => {
    activeName.value = tab;
    router.replace('/set/'+tab)
}
</script>
<style lang='scss' scoped>
@use '@/styles/setPage.scss';
</style>