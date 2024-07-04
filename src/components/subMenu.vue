<template>
    <el-sub-menu v-if="menus.children&&menus.children.length>0" :index="menus.meta.name">
        <template #title>
            <el-icon><Menu/></el-icon>
            <span>{{ menus.meta.name }}</span>
        </template>
        <SubMenu v-for="(item,index) in menus.children" :key="index" :menus="item"/>
    </el-sub-menu>
    <el-menu-item v-else :index="menus.path">
        <el-icon><Location/></el-icon>
        <span>{{ menus.meta.name }}</span>
    </el-menu-item>
</template>
<script setup>
import SubMenu from './subMenu.vue'
const props = defineProps(['menus'])
const menus = props.menus;
</script>