<template>
    <div class="native-sub-menu">
        <!-- 有子菜单时 -->
        <div 
            v-if="hasChildren" 
            class="native-sub-menu__title"
            :class="{ 'is-open': isOpen }"
            @click="toggleSubMenu"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            ref="menuTitleRef"
        >
            <SvgIcon name="分组" class="native-menu-icon"/>
            <span v-if="!collapse" class="native-menu-text">{{ menu.name }}</span>
            <span v-if="!collapse" class="native-menu-arrow" :class="{ 'rotated': isOpen }">›</span>
        </div>
        
        <!-- 使用Teleport把下拉菜单挂载到body上 -->
        <Teleport to="body">
            <div 
                v-if="collapse && isHovering" 
                class="native-sub-menu__dropdown"
                :style="dropdownStyle"
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave"
            >
                <div class="native-sub-menu__dropdown-title">
                    <SvgIcon name="分组" class="native-menu-icon"/>
                    <span>{{ menu.name }}</span>
                </div>
                <div class="native-sub-menu__dropdown-children">
                    <NativeSubMenu 
                        v-for="(item, index) in menu.children" 
                        :key="index" 
                        :menu="item" 
                        :parent-path="fullPath"
                        :collapse="false"
                        :active-path="activePath"
                        @menu-click="handleSubMenuClick"
                    />
                </div>
            </div>
        </Teleport>

        <!-- 展开子菜单 -->
        <div v-if="hasChildren && isOpen && !collapse" class="native-sub-menu__children">
            <NativeSubMenu 
                v-for="(item, index) in menu.children" 
                :key="index" 
                :menu="item" 
                :parent-path="fullPath"
                :collapse="collapse"
                :active-path="activePath"
                @menu-click="$emit('menu-click', $event)"
            />
        </div>

        <!-- 没有子菜单时，是菜单项 -->
        <div 
            v-if="!hasChildren"
            class="native-menu-item"
            :class="{ 'is-active': isActive }"
            @click="handleMenuItemClick"
        >
            <el-tooltip :content="menu.name" placement="right" :disabled="!collapse">
                <SvgIcon :name="menu.icon" class="native-menu-icon"/>
            </el-tooltip>
            <span v-if="!collapse" class="native-menu-text">{{ menu.name }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { resolveMenuFullPath } from '@/utils/menuRoute'
import SvgIcon from './SvgIcon/index.vue'

const props = defineProps({
    menu: {
        type: Object,
        required: true
    },
    parentPath: {
        type: String,
        default: ''
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

const isOpen = ref(false)
const isHovering = ref(false)
const menuTitleRef = ref(null)
let leaveTimer = null

const dropdownStyle = computed(() => {
    if (!menuTitleRef.value) return {}
    const rect = menuTitleRef.value.getBoundingClientRect()
    return {
        position: 'fixed',
        left: `${rect.right}px`,
        top: `${rect.top}px`,
        marginTop: '-4px',
        marginLeft: '4px',
    }
})

const hasChildren = computed(() => {
    return props.menu?.children && props.menu.children.length > 0
})

const fullPath = computed(() => resolveMenuFullPath(props.parentPath, props.menu?.path))

const isActive = computed(() => props.activePath === fullPath.value)

// 检查当前菜单路径是否是激活路径的父路径，即是否需要展开
const isParentOfActive = computed(() => {
    if (!props.activePath || !hasChildren.value) return false
    return props.activePath.startsWith(fullPath.value)
})

const toggleSubMenu = () => {
    isOpen.value = !isOpen.value
    // 保存菜单展开状态
    saveMenuState()
}

// 保存菜单状态到 localStorage
const saveMenuState = () => {
    const menuState = JSON.parse(localStorage.getItem('menuState') || '{}')
    menuState[fullPath.value] = isOpen.value
    localStorage.setItem('menuState', JSON.stringify(menuState))
}

// 从 localStorage 恢复菜单状态
const restoreMenuState = () => {
    const menuState = JSON.parse(localStorage.getItem('menuState') || '{}')
    if (menuState[fullPath.value] !== undefined) {
        isOpen.value = menuState[fullPath.value]
    } else if (isParentOfActive.value) {
        // 如果是激活路由的父菜单，默认展开
        isOpen.value = true
    }
}

const handleMouseEnter = () => {
    if (props.collapse) {
        if (leaveTimer) {
            clearTimeout(leaveTimer)
            leaveTimer = null
        }
        isHovering.value = true
        nextTick()
    }
}

const handleMouseLeave = () => {
    if (leaveTimer) {
        clearTimeout(leaveTimer)
    }
    leaveTimer = setTimeout(() => {
        isHovering.value = false
    }, 100)
}

const handleMenuItemClick = () => {
    emit('menu-click', fullPath.value)
}

const handleSubMenuClick = (path) => {
    isHovering.value = false
    emit('menu-click', path)
}

// 监听激活路由变化，自动展开父菜单
watch(() => props.activePath, (newPath) => {
    if (hasChildren.value && newPath.startsWith(fullPath.value)) {
        isOpen.value = true
        saveMenuState()
    }
}, { immediate: true })

onMounted(() => {
    restoreMenuState()
})
</script>

<style lang="scss" scoped>
.native-sub-menu {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

.native-sub-menu__title,
.native-menu-item {
    height: 36px;
    line-height: 36px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--menu-text);
    position: relative;
    margin: 2px 0;
    user-select: none;

    &:hover {
        background: var(--menu-bg-active);
        color: var(--menu-text-active);
    }

    &.is-active {
        color: var(--menu-text-active) !important;
        background: var(--menu-bg-active);
        font-weight: 600;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 20px;
            background: var(--primary);
            border-radius: 0 2px 2px 0;
        }
    }
}

.native-sub-menu__title {
    .native-menu-arrow {
        margin-left: auto;
        font-size: 20px;
        font-weight: bold;
        transition: transform var(--transition-fast);
        transform: rotate(0deg);

        &.rotated {
            transform: rotate(90deg);
        }
    }
}

.native-menu-icon {
    font-size: 14px;
    flex-shrink: 0;
}

.native-menu-text {
    margin-left: 8px;
    font-size: var(--font-size-sm);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.native-sub-menu__children {
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

/* 收起状态下的下拉菜单 */
.native-sub-menu__dropdown {
    min-width: 200px;
    max-height: 400px;
    background: var(--bg-elevated);
    border-radius: 0 var(--border-radius) var(--border-radius) var(--border-radius);
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.native-sub-menu__dropdown-title {
    height: 36px;
    line-height: 36px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: var(--menu-text-active);
    font-weight: 600;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    user-select: none;

    .native-menu-icon {
        margin-right: 8px;
    }
}

.native-sub-menu__dropdown-children {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px;
    overflow-y: auto;
}
</style>
