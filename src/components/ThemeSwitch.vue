<template>
    <el-tooltip :content="currentTheme === 'dark' ? '切换浅色模式' : '切换深色模式'" placement="bottom">
        <button
            type="button"
            class="theme-switch"
            :aria-label="currentTheme === 'dark' ? '切换浅色模式' : '切换深色模式'"
            @click="toggleTheme">
            <el-icon>
                <Sunny v-if="currentTheme === 'dark'" />
                <Moon v-else />
            </el-icon>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { persistenceHtmlTheme } from '@/utils/saveHtmlTheme'

const currentTheme = ref('dark')

onMounted(() => {
    currentTheme.value = document.documentElement.getAttribute('data-theme') || 'dark'
})

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    persistenceHtmlTheme(currentTheme.value)
}
</script>

<style scoped lang="scss">
/* 主题开关。原来带 14px 磨砂和 hover 上浮 + 紫色投影（#7c3aed 的残留），
   终端里这些都去掉：方角、平色、只换描边和文字色。 */
.theme-switch {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--hairline);
    border-radius: 0;
    cursor: pointer;
    transition: color var(--transition-fast), border-color var(--transition-fast),
        background-color var(--transition-fast);
}

.theme-switch:hover {
    color: var(--brand);
    background: var(--surface-muted);
    border-color: var(--brand);
}

.theme-switch:focus-visible {
    outline: 1px solid var(--brand);
    outline-offset: 1px;
}
</style>
