<template>
    <div class="dx-menu">
        <SubMenu
            v-for="(item, index) in menuConfig"
            :key="item.path || index"
            :menus="item"
            parent-path=""
            @menu-click="handleSelect" />
    </div>
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

const handleSelect = ({ menu, fullPath }) => {
    emit('menu-click', fullPath)
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
.dx-menu{
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
