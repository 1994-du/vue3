<template>
    <nav class="dx-menu" aria-label="主导航">
        <SubMenu
            v-for="(item, index) in menuConfig"
            :key="item.path || index"
            :menus="item"
            :collapse="collapse"
            :active-path="activePath"
            parent-path=""
            @menu-click="handleSelect"
        />
    </nav>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { MenuItem } from '@/store/pinia/userInfo'
import SubMenu from './subMenu.vue'

defineProps({
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

const emit = defineEmits<{
    (event: 'menu-click', path: string): void
}>()

const handleSelect = ({ fullPath }: { fullPath: string }) => {
    emit('menu-click', fullPath)
}
</script>

<style lang="scss" scoped>
.dx-menu {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
