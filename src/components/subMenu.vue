<template>
    <el-sub-menu v-if="menus.children&&menus.children.length>0" :index="menus.path">
        <template #title>
            <el-icon><Menu/></el-icon>
            <span>{{ menus.title }}</span>
        </template>
        <SubMenu v-for="(item,index) in menus.children" :key="index" :menus="item"/>
    </el-sub-menu>
    <el-menu-item v-else :index="menus.path">
        <el-icon><Location/></el-icon>
        <span>{{ menus.title }}</span>
    </el-menu-item>
</template>
<script setup>
import { Location, Menu } from '@element-plus/icons-vue'
import SubMenu from './subMenu.vue'
import { ref } from 'vue'
const props = defineProps(['menus'])
const menus = props.menus;
</script>