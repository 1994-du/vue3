<template>
    <nav class="dx-menu" aria-label="主导航">
        <SubMenu
            v-for="(item, index) in menuConfig"
            :key="item.path || index"
            :menus="item"
            :collapse="collapse"
            :active-path="activePath"
            :open-paths="openPaths"
            :flyout-path="flyoutPath"
            parent-path=""
            @toggle="handleToggle"
            @flyout-toggle="handleFlyoutToggle"
            @menu-click="handleSelect"
        />
    </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import type { MenuItem } from '@/store/pinia/userInfo'
import { resolveMenuFullPath } from '@/utils/menuRoute'
import SubMenu from './subMenu.vue'

interface BranchRecord {
    path: string
    parentPath: string
    defaultOpen: boolean
}

interface ToggleEvent {
    fullPath: string
}

interface FlyoutToggleEvent {
    fullPath: string
}

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

const emit = defineEmits<{
    (event: 'menu-click', path: string): void
}>()

const collectBranches = (
    menus: MenuItem[],
    parentPath = '',
    result: BranchRecord[] = []
): BranchRecord[] => {
    menus.forEach(menu => {
        const fullPath = resolveMenuFullPath(parentPath, menu.path)
        if (menu.children?.length) {
            result.push({
                path: fullPath,
                parentPath,
                defaultOpen: Boolean(menu.open)
            })
            collectBranches(menu.children, fullPath, result)
        }
    })
    return result
}

const findActiveLineage = (
    menus: MenuItem[],
    targetPath: string,
    parentPath = ''
): { found: boolean; branches: string[] } => {
    for (const menu of menus) {
        const fullPath = resolveMenuFullPath(parentPath, menu.path)
        const hasChildren = Boolean(menu.children?.length)

        if (fullPath === targetPath) {
            return {
                found: true,
                branches: hasChildren ? [fullPath] : []
            }
        }

        if (hasChildren) {
            const childResult = findActiveLineage(menu.children || [], targetPath, fullPath)
            if (childResult.found) {
                return {
                    found: true,
                    branches: [fullPath, ...childResult.branches]
                }
            }
        }
    }

    return { found: false, branches: [] }
}

const branchRecords = computed(() => collectBranches(props.menuConfig))
const branchMap = computed(() => new Map(branchRecords.value.map(branch => [branch.path, branch])))
const openPaths = ref<string[]>([])
const flyoutPath = ref('')
let hasInitialized = false

const isDescendantBranch = (candidatePath: string, ancestorPath: string): boolean => {
    let current = branchMap.value.get(candidatePath)
    while (current?.parentPath) {
        if (current.parentPath === ancestorPath) return true
        current = branchMap.value.get(current.parentPath)
    }
    return false
}

const removeBranch = (paths: Set<string>, targetPath: string) => {
    Array.from(paths).forEach(path => {
        if (path === targetPath || isDescendantBranch(path, targetPath)) {
            paths.delete(path)
        }
    })
}

const openBranch = (paths: Set<string>, targetPath: string) => {
    const target = branchMap.value.get(targetPath)
    if (!target) return

    Array.from(paths).forEach(path => {
        const branch = branchMap.value.get(path)
        if (path !== targetPath && branch?.parentPath === target.parentPath) {
            removeBranch(paths, path)
        }
    })

    paths.add(targetPath)
}

const saveOpenPaths = () => {
    const state = Object.fromEntries(openPaths.value.map(path => [path, true]))
    localStorage.setItem('menuState', JSON.stringify(state))
}

const readStoredOpenPaths = (): string[] => {
    try {
        const state = JSON.parse(localStorage.getItem('menuState') || '{}')
        if (!state || typeof state !== 'object') return []
        return Object.keys(state).filter(path => state[path] === true)
    } catch {
        return []
    }
}

const getFallbackActiveLineage = (activePath: string): string[] => {
    return branchRecords.value
        .filter(branch => {
            if (branch.path === '/') return activePath === '/'
            return activePath === branch.path || activePath.startsWith(`${branch.path}/`)
        })
        .map(branch => branch.path)
}

const syncMenuState = () => {
    if (!props.menuConfig.length) {
        openPaths.value = []
        return
    }

    const validPaths = new Set(branchRecords.value.map(branch => branch.path))
    const nextPaths = new Set<string>()

    const initialPaths = hasInitialized
        ? openPaths.value
        : [
            ...readStoredOpenPaths(),
            ...branchRecords.value.filter(branch => branch.defaultOpen).map(branch => branch.path)
        ]

    initialPaths.forEach(path => {
        if (validPaths.has(path)) openBranch(nextPaths, path)
    })

    const activeResult = findActiveLineage(props.menuConfig, props.activePath)
    const activeLineage = activeResult.found
        ? activeResult.branches
        : getFallbackActiveLineage(props.activePath)

    activeLineage.forEach(path => openBranch(nextPaths, path))

    openPaths.value = Array.from(nextPaths)
    hasInitialized = true
    saveOpenPaths()
}

watch(
    [branchRecords, () => props.activePath],
    syncMenuState,
    { immediate: true }
)

const handleToggle = ({ fullPath }: ToggleEvent) => {
    const nextPaths = new Set(openPaths.value)

    if (nextPaths.has(fullPath)) {
        removeBranch(nextPaths, fullPath)
    } else {
        openBranch(nextPaths, fullPath)
    }

    openPaths.value = Array.from(nextPaths)
    saveOpenPaths()
}

const handleFlyoutToggle = ({ fullPath }: FlyoutToggleEvent) => {
    flyoutPath.value = fullPath
}

const handleSelect = ({ fullPath }: { fullPath: string }) => {
    flyoutPath.value = ''
    emit('menu-click', fullPath)
}
</script>

<style lang="scss" scoped>
.dx-menu {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
</style>
