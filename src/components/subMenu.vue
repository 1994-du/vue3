<template>
    <el-sub-menu v-if="menus.children&&menus.children.length>0" :index="menus.menuName">
        <template #title>
            <el-icon><Folder /></el-icon>
            <el-text truncated>{{ menus.groupName }}</el-text>
        </template>
        <SubMenu v-for="(item,index) in menus.children" :key="index" :menus="item"/>
    </el-sub-menu>
    <el-menu-item v-else :index="menus.menuLink">
        <el-icon><Document /></el-icon>
        <el-text truncated>{{ menus.menuName }}</el-text>
    </el-menu-item>
</template>
<script setup>
import SubMenu from './subMenu.vue'
import { Folder, Document } from '@element-plus/icons-vue'
const props = defineProps(['menus'])
const menus = props.menus;
</script>
<style lang="scss" scoped>
:deep(.vue3-sub-menu__title){
    user-select: none;
}
.vue3-text{
    color: inherit;
}
// .vue3-menu-item{
//     display: flex;
// }
</style>