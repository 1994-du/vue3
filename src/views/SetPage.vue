<template>
    <h4>设置</h4>
    <el-button @click="saveMenuBtn">保存菜单</el-button>
</template>
<script setup>
import menuRoutes from '@/utils/menuRoutes';
const saveMenuBtn = async () => {
    try {
        const transaction = window.db.transaction(['menus'], 'readwrite');
        const objectStore = transaction.objectStore('menus');
        const request = await objectStore.add(menuRoutes);
    }
    catch (e) {
        console.log('菜单保存失败',e);
    }
}
</script>
<style lang='scss' scoped>
</style>