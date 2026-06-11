<template>
    <el-sub-menu v-if="hasChildren" :index="fullPath">
        <template #title>
            <span class="app-side-menu__content">
                <SvgIcon v-if="menus.icon" :name="menus.icon" class="app-side-menu__icon app-side-menu__svg-icon" />
                <el-icon v-else class="app-side-menu__icon app-side-menu__ep-icon">
                    <FolderOpened />
                </el-icon>
                <span class="app-side-menu__text">{{ menus.name }}</span>
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
        <span class="app-side-menu__content">
            <SvgIcon v-if="menus.icon" :name="menus.icon" class="app-side-menu__icon app-side-menu__svg-icon" />
            <el-icon v-else class="app-side-menu__icon app-side-menu__ep-icon">
                <FolderOpened />
            </el-icon>
            <span class="app-side-menu__text">{{ menus.name }}</span>
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
.app-side-menu__content {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    min-width: 0;
    width: 100%;
    line-height: 1;
}

.app-side-menu__icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    font-size: 18px;
    color: inherit;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
}

.app-side-menu__svg-icon,
.app-side-menu__ep-icon {
    width: 18px;
    height: 18px;
    font-size: 18px;
    color: inherit;
    flex-shrink: 0;
}

.app-side-menu__svg-icon:deep(.svg-icon) {
    display: block;
    vertical-align: middle;
}

.app-side-menu__text {
    display: inline-flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: inherit;
    text-shadow: 0 1px 10px rgba(15, 23, 42, 0.16);
    line-height: 1;
}
</style>
