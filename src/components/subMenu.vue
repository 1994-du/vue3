<template>
    <el-sub-menu v-if="menus.children&&menus.children.length>0" :index="menus.path">
        <template #title>
            <SvgIcon name="分组" class="text-lg mr-2"/>
            <el-text truncated class="text-lg">{{ menus.name }}</el-text>
        </template>
        <SubMenu v-for="(item,index) in menus.children" :key="index" :menus="item"/>
    </el-sub-menu>
    <el-menu-item v-else :index="menus.path">
        <SvgIcon :name="menus.icon" class="text-lg mr-2"/>
        <el-text truncated class="text-lg">{{ menus.name }}</el-text>
    </el-menu-item>
</template>
<script setup>
import SubMenu from './subMenu.vue'
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
</style>