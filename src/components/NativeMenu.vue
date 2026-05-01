<template>
    <div class="native-menu" :class="{ 'native-menu--collapse': collapse }">
        <NativeSubMenu 
            v-for="(item, index) in menuConfig" 
            :key="index" 
            :menu="item" 
            :parent-path="''"
            :collapse="collapse"
            :active-path="activePath"
            @menu-click="handleMenuClick"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import NativeSubMenu from './NativeSubMenu.vue'

const props = defineProps({
    menuConfig: {
        type: Array,
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

const handleMenuClick = (path) => {
    emit('menu-click', path)
}
</script>

<style lang="scss" scoped>
.native-menu {
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
