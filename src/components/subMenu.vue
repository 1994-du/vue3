<template>
    <!-- 有子菜单 -->
    <div class="dx-sub-menu" v-if="hasChildren">
        <div class="dx-sub-menu-title" @click="toggleOpen">
            <div class="dx-sub-menu-title-left">
                <SvgIcon v-if="menus.icon" :name="menus.icon" class="svg-icon22" />
                <span v-if="!collapse" class="menu-title">{{ menus.name }}</span>
            </div>
            <SvgIcon v-if="!collapse" name="xiangyou" :class="menus.open ? 'open' : 'closed'" />
        </div>

        <SubMenu 
            v-if="!collapse &&menus.open" 
            v-for="(item, index) in menus.children" 
            :key="item.path || index" 
            :menus="item"
            :parent-path="fullPath" 
            :collapse="collapse"
            @menu-click="emitMenuClick" 
            style="padding-left:20px;"/>
    </div>

    <!-- 没有子菜单 -->
    <div v-else class="dx-menu-item" @click="handleLeafClick">
        <div class="dx-sub-menu-title">
            <SvgIcon v-if="menus.icon" :name="menus.icon" class="svg-icon22" />
            <span v-if="!collapse" class="menu-title">{{ menus.name }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SvgIcon from './SvgIcon/index.vue'
import { resolveMenuFullPath } from '@/utils/menuRoute'

interface MenuClickEvent {
    menu: any
    fullPath: string
}

const props = defineProps({
    collapse: {
        type: Boolean,
        default: false
    },
    menus: {
        type: Object,
        required: true
    },
    parentPath: {
        type: String,
        default: ''
    }
})

const emit = defineEmits<{
    (e: 'menu-click', payload: MenuClickEvent): void
}>()

/**
 * 是否存在子菜单
 */
const hasChildren = computed(() => {
    return !!props.menus.children?.length
})

/**
 * 当前菜单完整路径
 */
const fullPath = computed(() => {
    return resolveMenuFullPath(props.parentPath, props.menus.path)
})

/**
 * 展开/收起
 */
const toggleOpen = () => {
    props.menus.open = !props.menus.open
}

/**
 * 点击叶子菜单
 */
const handleLeafClick = () => {
    emitMenuClick({
        menu: props.menus,
        fullPath: fullPath.value
    })
}

/**
 * 统一事件出口
 * 当前点击、子组件点击都走这里
 */
const emitMenuClick = (payload: MenuClickEvent) => {
    emit('menu-click', payload)
}
</script>

<style lang="scss" scoped>
.dx-menu-item {
    // height: 45px;
    .dx-sub-menu-title {
        cursor: pointer;
        user-select: none;
        padding: 10px 15px;
        height: 100%;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content:unset!important;
        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .svg-icon22 {
            font-size: 26px;
            flex-shrink: 0;
            margin-right: 10px;
        }
    }
}

.dx-sub-menu {
    .dx-sub-menu-title {
        // height: 45px;
        cursor: pointer;
        user-select: none;
        padding: 10px 15px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .dx-sub-menu-title-left {
            display: flex;
            align-items: center;
        }

        .svg-icon22 {
            font-size: 26px;
            flex-shrink: 0;
            margin-right: 10px;
        }

        .open {
            font-size: 26px;
            transform: rotate(90deg);
            transition: .2s;
        }

        .closed {
            font-size: 26px;
            transition: .2s;
        }
    }
}
</style>