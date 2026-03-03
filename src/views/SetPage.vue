<template>
  <div class="set_page">
    <div class="set_menu">
        <el-menu :default-active="defaultActive" @select="handleSelect">
            <el-menu-item index="menuManagement">菜单设置</el-menu-item>
            <el-menu-item index="userManagement">用户设置</el-menu-item>
            <el-menu-item index="roleManagement">角色设置</el-menu-item>
        </el-menu>
        <dx-button type="primary" @click="router.back()">返回</dx-button>
    </div>
    <div class="set_content">
        <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
// tab切换
const activeName = ref('menuManagement');
const defaultActive =  computed(()=>{
    return route.path.split('/')[2]
})
// 菜单选择
const handleSelect = (tab) => {
    activeName.value = tab;
    router.replace('/set/'+tab)
}
</script>
<style lang='scss' scoped>
@use '@/styles/setPage.scss';
</style>