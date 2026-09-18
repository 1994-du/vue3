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
.theme-switch {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    color: var(--text-secondary);
    background: var(--glass);
    border: 1px solid var(--hairline);
    border-radius: var(--radius-pill);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    cursor: pointer;
    transition: transform var(--transition-fast), color var(--transition-fast),
        background-color var(--transition-fast), border-color var(--transition-fast),
        box-shadow var(--transition-fast);
}

.theme-switch:hover {
    transform: translateY(-2px);
    color: var(--text-primary);
    background: var(--glass-strong);
    border-color: color-mix(in srgb, var(--brand) 45%, var(--hairline));
    box-shadow: 0 10px 26px -14px rgba(124, 58, 237, 0.7);
}

.theme-switch:active {
    transform: translateY(0);
}
</style>
