<template>
    <div v-if="hasChildren" class="menu-group">
        <button
            type="button"
            class="menu-row menu-row--parent"
            :class="{ 'is-branch-active': isBranchActive }"
            :title="collapse ? menus.name : undefined"
            @click="toggleOpen">
            <span class="menu-row__main">
                <SvgIcon v-if="menus.icon" :name="menus.icon" class="menu-row__icon" />
                <span v-else class="menu-row__dot" aria-hidden="true"></span>
                <span v-if="!collapse" class="menu-row__label">{{ menus.name }}</span>
            </span>
            <el-icon v-if="!collapse" class="menu-row__arrow" :class="{ 'is-open': isOpen }">
                <ArrowRight />
            </el-icon>
        </button>

        <div v-show="!collapse && isOpen" class="menu-children">
            <SubMenu
                v-for="(item, index) in menus.children"
                :key="item.path || index"
                :menus="item"
                :parent-path="fullPath"
                :collapse="collapse"
                :active-path="activePath"
                @menu-click="emitMenuClick"
            />
        </div>
    </div>

    <button
        v-else
        type="button"
        class="menu-row menu-row--leaf"
        :class="{ 'is-active': isActive }"
        :title="collapse ? menus.name : undefined"
        @click="handleLeafClick">
        <span class="menu-row__main">
            <SvgIcon v-if="menus.icon" :name="menus.icon" class="menu-row__icon" />
            <span v-else class="menu-row__dot" aria-hidden="true"></span>
            <span v-if="!collapse" class="menu-row__label">{{ menus.name }}</span>
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
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
    },
    activePath: {
        type: String,
        default: ''
    }
})

const emit = defineEmits<{
    (event: 'menu-click', payload: MenuClickEvent): void
}>()

const fullPath = computed(() => resolveMenuFullPath(props.parentPath, props.menus.path))
const hasChildren = computed(() => Boolean(props.menus.children?.length))
const isActive = computed(() => props.activePath === fullPath.value)
const isBranchActive = computed(() => {
    return props.activePath === fullPath.value || props.activePath.startsWith(fullPath.value + '/')
})

const readInitialOpenState = (): boolean => {
    try {
        const menuState = JSON.parse(localStorage.getItem('menuState') || '{}')
        return Boolean(menuState[fullPath.value] ?? props.menus.open ?? isBranchActive.value)
    } catch {
        return Boolean(props.menus.open || isBranchActive.value)
    }
}

const isOpen = ref(readInitialOpenState())

watch(isBranchActive, active => {
    if (active) isOpen.value = true
})

const saveOpenState = () => {
    let menuState: Record<string, boolean> = {}
    try {
        menuState = JSON.parse(localStorage.getItem('menuState') || '{}')
    } catch {
        menuState = {}
    }
    menuState[fullPath.value] = isOpen.value
    localStorage.setItem('menuState', JSON.stringify(menuState))
}

const toggleOpen = () => {
    isOpen.value = !isOpen.value
    saveOpenState()
}

const handleLeafClick = () => {
    emitMenuClick({
        menu: props.menus,
        fullPath: fullPath.value
    })
}

const emitMenuClick = (payload: MenuClickEvent) => {
    emit('menu-click', payload)
}
</script>

<style lang="scss" scoped>
.menu-group,
.menu-children {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.menu-children {
    position: relative;
    margin: 2px 0 4px 17px;
    padding-left: 10px;
}

.menu-children::before {
    content: '';
    position: absolute;
    inset: 2px auto 2px 0;
    width: 1px;
    background: #35443f;
}

.menu-row {
    width: 100%;
    min-width: 0;
    height: 40px;
    padding: 0 11px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: #aebdb7;
    background: transparent;
    border: 0;
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: left;
    transition: color var(--transition-fast), background-color var(--transition-fast);
}

.menu-row:hover,
.menu-row.is-branch-active {
    color: #f6faf8;
    background: var(--sidebar-hover);
}

.menu-row.is-active {
    color: #123029;
    background: var(--sidebar-active);
    font-weight: 700;
}

.menu-row__main {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.menu-row__icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    font-size: 18px;
}

.menu-row__dot {
    width: 6px;
    height: 6px;
    margin: 0 6px;
    flex-shrink: 0;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.55;
}

.menu-row__label {
    min-width: 0;
    overflow: hidden;
    font-size: 13px;
    line-height: 1.3;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.menu-row__arrow {
    flex-shrink: 0;
    font-size: 12px;
    transition: transform var(--transition-fast);
}

.menu-row__arrow.is-open {
    transform: rotate(90deg);
}

:global(.layout_menu.collapsed) .menu-row {
    justify-content: center;
    padding: 0;
}

:global(.layout_menu.collapsed) .menu-row__main {
    justify-content: center;
}

@media (max-width: 900px) {
    :global(.layout_menu.collapsed) .menu-row {
        justify-content: space-between;
        padding: 0 11px;
    }
}
</style>
