<template>
    <el-menu
        class="app-side-menu"
        :default-active="activePath"
        :default-openeds="defaultOpeneds"
        :collapse="collapse"
        :collapse-transition="false"
        unique-opened
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
    >
        <SubMenu
            v-for="(item, index) in menuConfig"
            :key="item.path || index"
            :menus="item"
            parent-path=""
        />
    </el-menu>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { MenuItem } from '@/store/pinia/userInfo'
import { resolveMenuFullPath } from '@/utils/menuRoute'
import SubMenu from './subMenu.vue'

const props = defineProps({
    menuConfig: {
        type: Array as PropType<MenuItem[]>,
        required: true,
        default: () => []
    },
    collapse: {
        type: Boolean,
        default: false
    },
    activePath: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['menu-click'])

function readMenuState(): Record<string, boolean> {
    try {
        return JSON.parse(localStorage.getItem('menuState') || '{}')
    } catch {
        return {}
    }
}

function collectOpenPaths(menus: MenuItem[], activePath: string, parentPath: string = '', result: Set<string> = new Set()): Set<string> {
    const menuState = readMenuState()

    menus.forEach(menu => {
        const fullPath = resolveMenuFullPath(parentPath, menu.path)

        if (menu.children?.length) {
            if (menuState[fullPath] || (activePath && activePath.startsWith(fullPath))) {
                result.add(fullPath)
            }
            collectOpenPaths(menu.children, activePath, fullPath, result)
        }
    })

    return result
}

const defaultOpeneds = computed(() => Array.from(collectOpenPaths(props.menuConfig, props.activePath)))

const handleSelect = (path: string) => {
    emit('menu-click', path)
}

const handleOpen = (path: string) => {
    const menuState = readMenuState()
    menuState[path] = true
    localStorage.setItem('menuState', JSON.stringify(menuState))
}

const handleClose = (path: string) => {
    const menuState = readMenuState()
    menuState[path] = false
    localStorage.setItem('menuState', JSON.stringify(menuState))
}
</script>

<style lang="scss" scoped>
.app-side-menu {
    width: 100%;
    border-right: none;
    background: transparent;
    padding: 8px;

    :deep(.el-menu) {
        border-right: none;
        background: transparent;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
        min-height: 44px;
        height: 44px;
        margin: 4px 0;
        border-radius: 14px;
        color: rgba(248, 250, 252, 0.9);
        border: 1px solid transparent;
        background: transparent;
        transition: transform var(--transition-fast), background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
        font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        font-size: 14px;
        font-weight: 580;
        letter-spacing: 0.035em;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        &:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(0, 212, 255, 0.08));
            color: #fff;
            border-color: rgba(0, 212, 255, 0.2);
            transform: translateX(3px);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
        }
    }

    :deep(.el-menu-item.is-active) {
        color: #fff;
        background:
            linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(99, 102, 241, 0.22)),
            rgba(255, 255, 255, 0.06);
        border-color: rgba(0, 212, 255, 0.24);
        box-shadow: 0 14px 28px rgba(0, 212, 255, 0.14);
        font-weight: 600;
        position: relative;

        &::before {
            content: '';
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 24px;
            background: linear-gradient(180deg, var(--primary), var(--secondary));
            border-radius: 999px;
            box-shadow: 0 0 16px rgba(0, 212, 255, 0.42);
        }
    }

    :deep(.el-sub-menu.is-active > .el-sub-menu__title),
    :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
        color: #fff;
        background:
            linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(99, 102, 241, 0.22)),
            rgba(255, 255, 255, 0.06);
        border-color: rgba(0, 212, 255, 0.24);
        box-shadow: 0 14px 28px rgba(0, 212, 255, 0.14);
    }

    :deep(.el-sub-menu .el-menu) {
        margin-left: 12px;
        padding: 4px 0 6px 14px;
        border-left: 1px dashed rgba(255, 255, 255, 0.08);
        background: transparent;
    }

    :deep(.el-sub-menu .el-menu-item),
    :deep(.el-sub-menu .el-sub-menu__title) {
        min-height: 40px;
        height: 40px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.02em;
    }

    :deep(.el-sub-menu__title) {
        justify-content: flex-start;
    }

    :deep(.el-menu--collapse .el-sub-menu__title),
    :deep(.el-menu--collapse .el-menu-item) {
        justify-content: center;
        padding-left: 0;
        padding-right: 0;
    }

    :deep(.el-sub-menu__icon-arrow) {
        position: static;
        top: auto;
        right: auto;
        margin-top: 0;
        margin-left: auto;
        transform: none;
        flex-shrink: 0;
        width: 22px;
        height: 22px;
        padding: 5px;
        border-radius: 999px;
        color: rgba(255, 255, 255, 0.92);
        background: rgba(255, 255, 255, 0.1);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow),
    :deep(.el-sub-menu__title:hover .el-sub-menu__icon-arrow) {
        color: #fff;
        background: rgba(255, 255, 255, 0.16);
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
    }

    :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
        transform: rotate(90deg);
    }
}
</style>
