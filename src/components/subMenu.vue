<template>
    <template v-if="hasChildren">
        <el-popover
            v-if="collapse"
            v-model:visible="flyoutVisible"
            trigger="hover"
            placement="right-start"
            :width="252"
            :show-after="80"
            :hide-after="180"
            :enterable="true"
            :persistent="false"
            :offset="10"
            popper-class="menu-flyout-popper">
            <template #reference>
                <button
                    type="button"
                    class="menu-row menu-row--collapsed menu-row--parent"
                    :class="{
                        'is-active': isActive && hasPage,
                        'is-branch-active': isBranchActive
                    }"
                    :aria-label="menus.name"
                    aria-haspopup="menu"
                    :aria-expanded="flyoutVisible"
                    @mouseenter="setRootHovering(true)"
                    @mouseleave="setRootHovering(false)"
                    @keydown.right.prevent="flyoutVisible = true"
                    @keydown.down.prevent="flyoutVisible = true"
                    @keydown.escape.prevent="flyoutVisible = false">
                    <span class="menu-row__content">
                        <SvgIcon v-if="menus.icon" :name="menus.icon" class="menu-row__icon" />
                        <span v-else class="menu-row__dot" aria-hidden="true"></span>
                    </span>
                    <el-icon class="menu-row__flyout-hint" aria-hidden="true">
                        <ArrowRight />
                    </el-icon>
                </button>
            </template>

            <div
                class="menu-flyout"
                :aria-label="menus.name"
                @mouseenter="setRootHovering(true)"
                @mouseleave="setRootHovering(false)">
                <button
                    v-if="hasPage"
                    type="button"
                    class="menu-flyout__heading menu-flyout__heading--link"
                    @click="handleParentNavigation">
                    <span>{{ menus.name }}</span>
                    <span>打开页面</span>
                </button>
                <div v-else class="menu-flyout__heading">
                    <span>{{ menus.name }}</span>
                    <small>导航分组</small>
                </div>

                <div class="menu-flyout__items">
                    <SubMenu
                        v-for="(item, index) in menus.children"
                        :key="item.path || index"
                        :menus="item"
                        :parent-path="fullPath"
                        :collapse="false"
                        :active-path="activePath"
                        :open-paths="openPaths"
                        :flyout-path="flyoutPath"
                        :in-flyout="true"
                        @toggle="emitToggle"
                        @flyout-toggle="emitFlyoutToggle"
                        @cascade-hover="handleCascadeHover"
                        @menu-click="emitMenuClick"
                    />
                </div>
            </div>
        </el-popover>

        <el-popover
            v-else-if="inFlyout"
            v-model:visible="nestedFlyoutVisible"
            trigger="hover"
            placement="right-start"
            :width="252"
            :show-after="80"
            :hide-after="180"
            :enterable="true"
            :persistent="false"
            :offset="10"
            popper-class="menu-flyout-popper menu-flyout-popper--nested">
            <template #reference>
                <div
                    v-if="hasPage"
                    class="menu-row menu-row--parent menu-row--cascade"
                    :class="{
                        'is-active': isActive && hasPage,
                        'is-branch-active': isBranchActive,
                        'is-open': nestedFlyoutVisible
                    }">
                    <button
                        type="button"
                        class="menu-row__primary"
                        :aria-label="`打开${menus.name}`"
                        :aria-current="isActive ? 'page' : undefined"
                        :aria-expanded="nestedFlyoutVisible"
                        @click.stop="handleParentPrimary">
                        <span class="menu-row__content">
                            <SvgIcon v-if="menus.icon" :name="menus.icon" class="menu-row__icon" />
                            <span v-else class="menu-row__dot" aria-hidden="true"></span>
                            <span class="menu-row__label">{{ menus.name }}</span>
                        </span>
                    </button>
                    <span class="menu-row__toggle menu-row__toggle--indicator" aria-hidden="true">
                        <el-icon class="menu-row__arrow" :class="{ 'is-open': nestedFlyoutVisible }">
                            <ArrowRight />
                        </el-icon>
                    </span>
                </div>
                <button
                    v-else
                    type="button"
                    class="menu-row menu-row--parent menu-row--cascade"
                    :class="{
                        'is-branch-active': isBranchActive,
                        'is-open': nestedFlyoutVisible
                    }"
                    :aria-label="`${nestedFlyoutVisible ? '收起' : '展开'}${menus.name}`"
                    :aria-expanded="nestedFlyoutVisible"
                    @keydown.right.prevent="nestedFlyoutVisible = true"
                    @keydown.escape.prevent="nestedFlyoutVisible = false">
                    <span class="menu-row__content">
                        <SvgIcon v-if="menus.icon" :name="menus.icon" class="menu-row__icon" />
                        <span v-else class="menu-row__dot" aria-hidden="true"></span>
                        <span class="menu-row__label">{{ menus.name }}</span>
                    </span>
                    <el-icon class="menu-row__arrow menu-row__group-arrow" :class="{ 'is-open': nestedFlyoutVisible }">
                        <ArrowRight />
                    </el-icon>
                </button>
            </template>

            <div
                class="menu-flyout"
                :aria-label="menus.name"
                @mouseenter="handleCascadeHover(true)"
                @mouseleave="handleCascadeHover(false)">
                <button
                    v-if="hasPage"
                    type="button"
                    class="menu-flyout__heading menu-flyout__heading--link"
                    @click="handleParentNavigation">
                    <span>{{ menus.name }}</span>
                    <span>打开页面</span>
                </button>
                <div v-else class="menu-flyout__heading">
                    <span>{{ menus.name }}</span>
                    <small>导航分组</small>
                </div>

                <div class="menu-flyout__items">
                    <SubMenu
                        v-for="(item, index) in menus.children"
                        :key="item.path || index"
                        :menus="item"
                        :parent-path="fullPath"
                        :collapse="false"
                        :active-path="activePath"
                        :open-paths="openPaths"
                        :flyout-path="flyoutPath"
                        :in-flyout="true"
                        @toggle="emitToggle"
                        @flyout-toggle="emitFlyoutToggle"
                        @cascade-hover="handleCascadeHover"
                        @menu-click="emitMenuClick"
                    />
                </div>
            </div>
        </el-popover>

        <div v-else class="menu-group" :class="{ 'is-in-flyout': inFlyout }">
            <div
                v-if="hasPage"
                class="menu-row menu-row--parent"
                :class="{
                    'is-active': isActive && hasPage,
                    'is-branch-active': isBranchActive,
                    'is-open': isOpen
                }">
                <button
                    type="button"
                    class="menu-row__primary"
                    :aria-label="`${isOpen ? '收起' : '展开'}${menus.name}`"
                    :aria-current="isActive ? 'page' : undefined"
                    @click="handleParentPrimary">
                    <span class="menu-row__content">
                        <SvgIcon v-if="menus.icon" :name="menus.icon" class="menu-row__icon" />
                        <span v-else class="menu-row__dot" aria-hidden="true"></span>
                        <span class="menu-row__label">{{ menus.name }}</span>
                    </span>
                </button>
                <button
                    type="button"
                    class="menu-row__toggle"
                    :aria-label="`${isOpen ? '收起' : '展开'}${menus.name}`"
                    :aria-expanded="isOpen"
                    @click="toggleOpen">
                    <el-icon class="menu-row__arrow" :class="{ 'is-open': isOpen }">
                        <ArrowRight />
                    </el-icon>
                </button>
            </div>

            <button
                v-else
                type="button"
                class="menu-row menu-row--parent menu-row--group"
                :class="{
                    'is-branch-active': isBranchActive,
                    'is-open': isOpen
                }"
                :aria-label="`${isOpen ? '收起' : '展开'}${menus.name}`"
                :aria-expanded="isOpen"
                @click="toggleOpen"
                @keydown="handleParentKeydown">
                <span class="menu-row__content">
                    <SvgIcon v-if="menus.icon" :name="menus.icon" class="menu-row__icon" />
                    <span v-else class="menu-row__dot" aria-hidden="true"></span>
                    <span class="menu-row__label">{{ menus.name }}</span>
                </span>
                <el-icon class="menu-row__arrow menu-row__group-arrow" :class="{ 'is-open': isOpen }">
                    <ArrowRight />
                </el-icon>
            </button>

            <Transition name="menu-expand">
                <div v-if="isOpen" class="menu-children-shell">
                    <div class="menu-children">
                        <SubMenu
                            v-for="(item, index) in menus.children"
                            :key="item.path || index"
                            :menus="item"
                            :parent-path="fullPath"
                            :collapse="false"
                            :active-path="activePath"
                            :open-paths="openPaths"
                            :flyout-path="flyoutPath"
                            :in-flyout="inFlyout"
                            @toggle="emitToggle"
                            @flyout-toggle="emitFlyoutToggle"
                            @cascade-hover="handleCascadeHover"
                            @menu-click="emitMenuClick"
                        />
                    </div>
                </div>
            </Transition>
        </div>
    </template>

    <el-tooltip
        v-else
        :disabled="!collapse"
        :content="menus.name"
        placement="right"
        :show-after="320"
        :hide-after="0">
        <button
            type="button"
            class="menu-row menu-row--leaf"
            :class="{
                'menu-row--collapsed': collapse,
                'is-active': isActive
            }"
            :aria-label="collapse ? menus.name : undefined"
            :aria-current="isActive ? 'page' : undefined"
            @click="handleLeafClick">
            <span class="menu-row__content">
                <SvgIcon v-if="menus.icon" :name="menus.icon" class="menu-row__icon" />
                <span v-else class="menu-row__dot" aria-hidden="true"></span>
                <span v-if="!collapse" class="menu-row__label">{{ menus.name }}</span>
            </span>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type PropType } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import type { MenuItem } from '@/store/pinia/userInfo'
import { resolveMenuFullPath } from '@/utils/menuRoute'
import SvgIcon from './SvgIcon/index.vue'

interface MenuClickEvent {
    menu: MenuItem
    fullPath: string
}

interface ToggleEvent {
    fullPath: string
    parentPath: string
}

interface FlyoutToggleEvent {
    fullPath: string
}

const props = defineProps({
    collapse: {
        type: Boolean,
        default: false
    },
    menus: {
        type: Object as PropType<MenuItem>,
        required: true
    },
    parentPath: {
        type: String,
        default: ''
    },
    activePath: {
        type: String,
        default: ''
    },
    openPaths: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    flyoutPath: {
        type: String,
        default: ''
    },
    inFlyout: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits<{
    (event: 'toggle', payload: ToggleEvent): void
    (event: 'flyout-toggle', payload: FlyoutToggleEvent): void
    (event: 'cascade-hover', hovered: boolean): void
    (event: 'menu-click', payload: MenuClickEvent): void
}>()

const flyoutVisible = ref(false)
const rootHovering = ref(false)
const cascadeHovering = ref(false)
let rootCloseTimer: number | undefined
const fullPath = computed(() => resolveMenuFullPath(props.parentPath, props.menus.path))
const hasChildren = computed(() => Boolean(props.menus.children?.length))
const hasPage = computed(() => Boolean(props.menus.component))
const isOpen = computed(() => props.openPaths.includes(fullPath.value))
const isActive = computed(() => props.activePath === fullPath.value)
const nestedFlyoutVisible = computed({
    get: () => props.flyoutPath === fullPath.value,
    set: visible => {
        if (visible === (props.flyoutPath === fullPath.value)) return
        emit('flyout-toggle', {
            fullPath: visible ? fullPath.value : ''
        })
    }
})

const containsActivePath = (
    menus: MenuItem[],
    targetPath: string,
    parentPath: string
): boolean => {
    return menus.some(menu => {
        const path = resolveMenuFullPath(parentPath, menu.path)
        if (path === targetPath) return true
        return Boolean(menu.children?.length && containsActivePath(menu.children, targetPath, path))
    })
}

const isBranchActive = computed(() => {
    if (fullPath.value === '/') return props.activePath === '/'
    return isActive.value
        || containsActivePath(props.menus.children || [], props.activePath, fullPath.value)
        || props.activePath.startsWith(`${fullPath.value}/`)
})

const clearRootCloseTimer = () => {
    if (rootCloseTimer !== undefined) {
        window.clearTimeout(rootCloseTimer)
        rootCloseTimer = undefined
    }
}

const scheduleRootClose = () => {
    clearRootCloseTimer()
    rootCloseTimer = window.setTimeout(() => {
        if (!rootHovering.value && !cascadeHovering.value) {
            flyoutVisible.value = false
        }
    }, 180)
}

const setRootHovering = (hovered: boolean) => {
    if (!props.collapse) return
    rootHovering.value = hovered
    if (hovered) {
        clearRootCloseTimer()
        flyoutVisible.value = true
    } else {
        scheduleRootClose()
    }
}

const handleCascadeHover = (hovered: boolean) => {
    if (props.collapse) {
        cascadeHovering.value = hovered
        if (hovered) {
            clearRootCloseTimer()
            flyoutVisible.value = true
        } else {
            scheduleRootClose()
        }
    }
    emit('cascade-hover', hovered)
}

onBeforeUnmount(clearRootCloseTimer)

const toggleOpen = () => {
    emit('toggle', {
        fullPath: fullPath.value,
        parentPath: props.parentPath
    })
}

const handleParentPrimary = () => {
    if (hasChildren.value && !props.inFlyout && !props.collapse) {
        toggleOpen()
        return
    }

    if (hasPage.value) {
        handleParentNavigation()
        return
    }
    toggleOpen()
}

const handleParentKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' && !isOpen.value) {
        event.preventDefault()
        toggleOpen()
    }
    if (event.key === 'ArrowLeft' && isOpen.value) {
        event.preventDefault()
        toggleOpen()
    }
}

const handleParentNavigation = () => {
    emitMenuClick({
        menu: props.menus,
        fullPath: fullPath.value
    })
}

const handleLeafClick = () => {
    emitMenuClick({
        menu: props.menus,
        fullPath: fullPath.value
    })
}

const emitToggle = (payload: ToggleEvent) => {
    emit('toggle', payload)
}

const emitFlyoutToggle = (payload: FlyoutToggleEvent) => {
    emit('flyout-toggle', payload)
}

const emitMenuClick = (payload: MenuClickEvent) => {
    clearRootCloseTimer()
    rootHovering.value = false
    cascadeHovering.value = false
    flyoutVisible.value = false
    emit('flyout-toggle', { fullPath: '' })
    emit('menu-click', payload)
}
</script>

<style lang="scss" scoped>
.menu-group,
.menu-children,
.menu-flyout__items {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.menu-group {
    min-width: 0;
}

.menu-children-shell {
    display: grid;
    grid-template-rows: 1fr;
    overflow: hidden;
}

.menu-children {
    min-height: 0;
    position: relative;
    margin: 3px 0 5px 17px;
    padding-left: 11px;
}

.menu-children::before {
    content: '';
    position: absolute;
    inset: 3px auto 3px 0;
    width: 1px;
    background: var(--menu-divider);
}

.menu-row {
    position: relative;
    width: 100%;
    min-width: 0;
    height: 40px;
    display: flex;
    align-items: center;
    color: var(--menu-text);
    background: transparent;
    border: 0;
    border-radius: var(--radius-sm);
    text-align: left;
    transition:
        color var(--transition-fast),
        background-color var(--transition-fast),
        box-shadow var(--transition-fast);
}

button.menu-row,
.menu-row button {
    cursor: pointer;
}

.menu-row--leaf {
    padding: 0 11px;
}

.menu-row--parent {
    padding: 0 4px 0 0;
}

button.menu-row--parent:not(.menu-row--collapsed) {
    padding-left: 11px;
}

.menu-row:hover,
.menu-row:focus-within {
    color: var(--menu-text-strong);
    background: var(--menu-hover);
}

.menu-row.is-branch-active:not(.is-active) {
    color: var(--menu-active-text);
    background: var(--menu-branch-bg);
}

.menu-row.is-open:not(.is-active) {
    color: var(--menu-text-strong);
}

.menu-row.is-active {
    color: var(--menu-active-text);
    background: var(--menu-active-bg);
    box-shadow: inset 0 0 0 1px var(--menu-active-ring);
    font-weight: 700;
}

.menu-row.is-active::before {
    content: '';
    position: absolute;
    inset: 7px auto 7px 0;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--menu-accent);
}

button.menu-row:active,
.menu-row__primary:active,
.menu-row__toggle:active {
    background-color: color-mix(in srgb, var(--menu-accent) 12%, transparent);
}

.menu-row__primary {
    min-width: 0;
    height: 100%;
    padding: 0 4px 0 11px;
    flex: 1;
    display: flex;
    align-items: center;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: var(--radius-sm) 0 0 var(--radius-sm);
    text-align: left;
}

.menu-row__content {
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

.menu-row__toggle {
    width: 32px;
    height: 32px;
    padding: 0;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: var(--radius-xs);
}

.menu-row__toggle:hover {
    background: var(--menu-hover);
}

.menu-row__toggle--indicator {
    pointer-events: none;
}

.menu-row__arrow {
    font-size: 12px;
    transition: transform var(--transition-base);
}

.menu-row__arrow.is-open {
    transform: rotate(90deg);
}

.menu-row--cascade .menu-row__arrow.is-open {
    transform: none;
}

.menu-row__group-arrow {
    margin: 0 7px 0 auto;
    flex-shrink: 0;
}

.menu-row--collapsed {
    justify-content: center;
    padding: 0;
}

.menu-row--collapsed.menu-row--parent {
    overflow: visible;
}

.menu-row--collapsed .menu-row__content {
    justify-content: center;
}

.menu-row__flyout-hint {
    position: absolute;
    top: 50%;
    right: 4px;
    width: 12px;
    height: 12px;
    font-size: 11px;
    transform: translateY(-50%);
    opacity: 0.72;
}

.menu-expand-enter-active,
.menu-expand-leave-active {
    transition:
        grid-template-rows var(--transition-base),
        opacity var(--transition-fast);
}

.menu-expand-enter-from,
.menu-expand-leave-to {
    grid-template-rows: 0fr;
    opacity: 0;
}

.menu-flyout {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.menu-flyout__heading {
    min-height: 40px;
    padding: 7px 10px 9px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--menu-text-strong);
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--menu-divider);
    text-align: left;
}

.menu-flyout__heading span:first-child {
    overflow: hidden;
    font-size: 13px;
    line-height: 1.3;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.menu-flyout__heading small,
.menu-flyout__heading span:last-child:not(:first-child) {
    flex-shrink: 0;
    color: var(--menu-text-muted);
    font-size: 10px;
    font-weight: 600;
}

.menu-flyout__heading--link {
    width: 100%;
    cursor: pointer;
    border-radius: var(--radius-xs) var(--radius-xs) 0 0;
}

.menu-flyout__heading--link:hover {
    background: var(--menu-hover);
}

.menu-flyout__items {
    max-height: min(60vh, 520px);
    overflow-y: auto;
}

:global(.menu-flyout__items .el-popover__reference-wrapper) {
    display: block;
    width: 100%;
}

:global(.menu-flyout-popper.el-popper) {
    padding: 8px !important;
    color: var(--menu-text) !important;
    background: var(--menu-bg) !important;
    border: 1px solid var(--menu-border) !important;
    border-radius: var(--radius-md) !important;
    box-shadow: var(--menu-shadow) !important;
}

:global(.menu-flyout-popper.el-popper .el-popper__arrow::before) {
    background: var(--menu-bg) !important;
    border-color: var(--menu-border) !important;
}

:global(.layout_menu .el-tooltip__trigger:focus-visible) {
    outline: 2px solid var(--menu-accent);
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    .menu-expand-enter-active,
    .menu-expand-leave-active,
    .menu-row__arrow {
        transition: none;
    }
}
</style>
