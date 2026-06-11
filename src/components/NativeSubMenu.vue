<template>
    <div class="native-sub-menu">
        <div
            v-if="hasChildren"
            class="native-sub-menu__title"
            :class="{ 'is-open': isOpen, 'is-active-parent': isParentOfActive }"
            @click="toggleSubMenu"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            ref="menuTitleRef"
        >
            <SvgIcon :name="menu.icon || '分组'" class="native-menu-icon"/>
            <span v-if="!collapse" class="native-menu-text">{{ menu.name }}</span>
            <span v-if="!collapse" class="native-menu-arrow" :class="{ rotated: isOpen }">›</span>
        </div>

        <Teleport to="body">
            <div
                v-if="collapse && isHovering"
                class="native-sub-menu__dropdown"
                :style="dropdownStyle"
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave"
            >
                <div class="native-sub-menu__dropdown-title">
                    <SvgIcon :name="menu.icon || '分组'" class="native-menu-icon"/>
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

        <div
            v-if="!hasChildren"
            class="native-menu-item"
            :class="{ 'is-active': isActive }"
            @click="handleMenuItemClick"
        >
            <el-tooltip :content="menu.name" placement="right" :disabled="!collapse">
                <SvgIcon :name="menu.icon || '菜单'" class="native-menu-icon"/>
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
        left: `${rect.right + 10}px`,
        top: `${rect.top - 6}px`
    }
})

const hasChildren = computed(() => {
    return props.menu?.children && props.menu.children.length > 0
})

const fullPath = computed(() => resolveMenuFullPath(props.parentPath, props.menu?.path))
const isActive = computed(() => props.activePath === fullPath.value)

const isParentOfActive = computed(() => {
    if (!props.activePath || !hasChildren.value) return false
    return props.activePath.startsWith(fullPath.value)
})

const toggleSubMenu = () => {
    isOpen.value = !isOpen.value
    saveMenuState()
}

const saveMenuState = () => {
    const menuState = JSON.parse(localStorage.getItem('menuState') || '{}')
    menuState[fullPath.value] = isOpen.value
    localStorage.setItem('menuState', JSON.stringify(menuState))
}

const restoreMenuState = () => {
    const menuState = JSON.parse(localStorage.getItem('menuState') || '{}')
    if (menuState[fullPath.value] !== undefined) {
        isOpen.value = menuState[fullPath.value]
    } else if (isParentOfActive.value) {
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
    min-height: 44px;
    display: flex;
    align-items: center;
    padding: 0 12px 0 10px;
    border-radius: 14px;
    cursor: pointer;
    transition: transform var(--transition-fast), background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
    color: rgba(248, 250, 252, 0.9);
    position: relative;
    margin: 4px 0;
    user-select: none;
    border: 1px solid transparent;
    backdrop-filter: blur(10px);
    font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
    text-rendering: optimizeLegibility;

    &:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(0, 212, 255, 0.08));
        color: rgba(255, 255, 255, 0.98);
        border-color: rgba(0, 212, 255, 0.2);
        transform: translateX(3px);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
    }

    &.is-active,
    &.is-active-parent {
        color: #fff !important;
        background:
            linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(99, 102, 241, 0.22)),
            rgba(255, 255, 255, 0.06);
        border-color: rgba(0, 212, 255, 0.24);
        box-shadow: 0 14px 28px rgba(0, 212, 255, 0.14);
    }

    &.is-active {
        font-weight: 600;

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
}

.native-sub-menu__title {
    overflow: hidden;

    &.is-open {
        color: rgba(255, 255, 255, 0.98);
    }

    .native-menu-arrow {
        margin-left: auto;
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 700;
        transition: transform var(--transition-fast), background var(--transition-fast);
        transform: rotate(0deg);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);

        &.rotated {
            transform: rotate(90deg);
        }
    }
}

.native-menu-icon {
    width: 26px;
    height: 26px;
    font-size: 14px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.native-menu-text {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 580;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.035em;
    text-shadow: 0 1px 10px rgba(15, 23, 42, 0.16);
    color: inherit;
}

.native-sub-menu__children {
    margin-left: 12px;
    padding: 4px 0 6px 14px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-left: 1px dashed rgba(255, 255, 255, 0.08);
}

.native-sub-menu__dropdown {
    min-width: 240px;
    max-height: 420px;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.97), rgba(30, 41, 59, 0.95));
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow: 0 22px 50px rgba(2, 6, 23, 0.36);
    z-index: 9999;
    padding: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(18px);
}

.native-sub-menu__dropdown-title {
    min-height: 42px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    color: rgba(255, 255, 255, 0.98);
    font-weight: 650;
    letter-spacing: 0.06em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
    user-select: none;
    margin-bottom: 6px;

    .native-menu-icon {
        margin-right: 8px;
    }
}

.native-sub-menu__dropdown-children {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 2px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.35);
        border-radius: 999px;
    }
}

:deep(.native-sub-menu__children .native-menu-item),
:deep(.native-sub-menu__children .native-sub-menu__title) {
    min-height: 40px;
    border-radius: 12px;
    padding-left: 8px;
}

:deep(.native-sub-menu__children .native-menu-icon) {
    width: 22px;
    height: 22px;
    border-radius: 8px;
    font-size: 13px;
}

:deep(.native-sub-menu__children .native-menu-text) {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.02em;
    opacity: 0.92;
}

:deep(.native-sub-menu__children .native-menu-item.is-active .native-menu-text),
:deep(.native-sub-menu__children .native-sub-menu__title.is-active-parent .native-menu-text),
:deep(.native-sub-menu__children .native-sub-menu__title.is-open .native-menu-text) {
    font-weight: 600;
    opacity: 1;
}
</style>
