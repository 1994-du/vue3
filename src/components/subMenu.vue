<template>
    <el-sub-menu v-if="menus.children&&menus.children.length>0" :index="fullPath">
        <template #title>
            <SvgIcon name="分组" class="text-lg mr-2"/>
            <el-text truncated class="text-lg">{{ menus.name }}</el-text>
        </template>
        <SubMenu v-for="(item,index) in menus.children" :key="index" :menus="item" :parent-path="fullPath"/>
    </el-sub-menu>
    <el-menu-item v-else :index="fullPath">
        <SvgIcon :name="menus.icon" class="text-lg mr-2"/>
        <el-text truncated class="text-lg">{{ menus.name }}</el-text>
    </el-menu-item>
</template>
<script setup>
import { computed } from 'vue'
import SubMenu from './subMenu.vue'
import { resolveMenuFullPath } from '@/utils/menuRoute'

const props = defineProps({
    menus: {
        type: Object,
        required: true
    },
    parentPath: {
        type: String,
        default: ''
    }
})

const menus = props.menus
const fullPath = computed(() => resolveMenuFullPath(props.parentPath, menus?.path))
</script>
<style lang="scss" scoped>
:deep(.vue3-sub-menu__title){
    user-select: none;
}
.vue3-text{
    color: inherit;
}
</style>
