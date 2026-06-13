<template>
    <el-sub-menu v-if="hasChildren" :index="fullPath">
        <template #title>
            <span class="menu-title">
                <SvgIcon v-if="menus.icon" :name="menus.icon"/>
                <el-icon v-else>
                    <FolderOpened />
                </el-icon>
                <span>{{ menus.name }}</span>
            </span>
        </template>
        <SubMenu
            v-for="(item, index) in menus.children"
            :key="item.path || index"
            :menus="item"
            :parent-path="fullPath"
        />
    </el-sub-menu>

    <el-menu-item v-else :index="fullPath">
        <span class="menu-title">
            <SvgIcon v-if="menus.icon" :name="menus.icon"/>
            <el-icon v-else>
                <FolderOpened />
            </el-icon>
            <span>{{ menus.name }}</span>
        </span>
    </el-menu-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FolderOpened } from '@element-plus/icons-vue'
import { resolveMenuFullPath } from '@/utils/menuRoute'
import SvgIcon from './SvgIcon/index.vue'

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

const hasChildren = computed(() => !!props.menus?.children?.length)
const fullPath = computed(() => resolveMenuFullPath(props.parentPath, props.menus?.path))
</script>

<style lang="scss" scoped>
.menu-title {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}
</style>
