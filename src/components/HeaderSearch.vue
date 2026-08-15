<template>
    <el-tooltip content="搜索菜单" placement="bottom">
        <button type="button" class="header-search" aria-label="搜索菜单">
            <el-icon><Search /></el-icon>
            <span class="header-search__label">搜索</span>
            <kbd>{{ currentKey }} F</kbd>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const currentKey = ref('Ctrl')

onMounted(() => {
    currentKey.value = window.navigator.userAgent.includes('Macintosh') ? '⌘' : 'Ctrl'
})
</script>

<style scoped lang="scss">
.header-search {
    height: 36px;
    padding: 0 9px;
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    cursor: pointer;
}

.header-search:hover {
    color: var(--brand);
    background: var(--brand-soft);
    border-color: color-mix(in srgb, var(--brand) 40%, var(--border-color));
}

.header-search__label {
    font-size: 12px;
    font-weight: 600;
}

kbd {
    min-width: 34px;
    height: 20px;
    padding: 0 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary);
    background: var(--surface-subtle);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xs);
    font-family: var(--font-sans);
    font-size: 10px;
    line-height: 1;
}

@media (max-width: 620px) {
    .header-search {
        width: 36px;
        padding: 0;
        justify-content: center;
    }

    .header-search__label,
    kbd {
        display: none;
    }
}
</style>
